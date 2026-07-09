/// Show 'inccommand' preview if command is previewable. It works like this:
///    1. Store current undo information so we can revert to current state later.
///    2. Execute the preview callback with the parsed command, preview buffer number and preview
///       namespace number as arguments. The preview callback sets the highlight and does the
///       changes required for the preview if needed.
///    3. Preview callback returns 0, 1 or 2. 0 means no preview is shown. 1 means preview is shown
///       but preview window doesn't need to be opened. 2 means preview is shown and preview window
///       needs to be opened if inccommand=split.
///    4. Use the return value of the preview callback to determine whether to
///       open the preview window or not and open preview window if needed.
///    5. If the return value of the preview callback is not 0, update the screen while the effects
///       of the preview are still in place.
///    6. Revert all changes made by the preview callback.
///
/// @return whether preview is shown or not.
static bool cmdpreview_may_show(CommandLineState *s)
{
  // Parse the command line and return if it fails.
  exarg_T ea;
  cmdmod_T cmod;
  // Copy the command line so we can modify it.
  int cmdpreview_type = 0;
  char *cmdline = xstrdup(ccline.cmdbuff);
  const char *errormsg = NULL;
  emsg_off++;  // Block errors when parsing the command line, and don't update v:errmsg
  if (!parse_cmdline(&cmdline, &ea, &cmod, &errormsg)) {
    emsg_off--;
    goto end;
  }
  emsg_off--;

  // Check if command is previewable, if not, don't attempt to show preview
  if (!(ea.argt & EX_PREVIEW)) {
    undo_cmdmod(&cmod);
    goto end;
  }

  // Cursor may be at the end of the message grid rather than at cmdspos.
  // Place it there in case preview callback flushes it. #30696
  cursorcmd();
  // Flush now: external cmdline may itself wish to update the screen which is
  // currently disallowed during cmdpreview (no longer needed in case that changes).
  cmdline_ui_flush();

  // Swap invalid command range if needed
  if ((ea.argt & EX_RANGE) && ea.line1 > ea.line2) {
    linenr_T lnum = ea.line1;
    ea.line1 = ea.line2;
    ea.line2 = lnum;
  }

  CpInfo cpinfo;
  bool icm_split = *p_icm == 's';  // inccommand=split
  buf_T *cmdpreview_buf = NULL;
  win_T *cmdpreview_win = NULL;

  emsg_silent++;                 // Block error reporting as the command may be incomplete,
                                 // but still update v:errmsg
  msg_silent++;                  // Block messages, namely ones that prompt
  block_autocmds();              // Block events

  // Save current state and prepare for command preview.
  cmdpreview_prepare(&cpinfo);

  // Open preview buffer if inccommand=split.
  if (icm_split && (cmdpreview_buf = cmdpreview_open_buf()) == NULL) {
    // Failed to create preview buffer, so disable preview.
    set_option_direct(kOptInccommand, STATIC_CSTR_AS_OPTVAL("nosplit"), 0, SID_NONE);
    icm_split = false;
  }
  // Setup preview namespace if it's not already set.
  if (!cmdpreview_ns) {
    cmdpreview_ns = (int)nvim_create_namespace((String)STRING_INIT);
  }

  // Set cmdpreview state.
  cmdpreview = true;

  // Execute the preview callback and use its return value to determine whether to show preview or
  // open the preview window. The preview callback also handles doing the changes and highlights for
  // the preview.
  Error err = ERROR_INIT;
