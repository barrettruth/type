UseCaptureKind llvm::DetermineUseCaptureKind(
    const Use &U,
    function_ref<bool(Value *, const DataLayout &)> IsDereferenceableOrNull) {
  Instruction *I = dyn_cast<Instruction>(U.getUser());

  // TODO: Investigate non-instruction uses.
  if (!I)
    return UseCaptureKind::MAY_CAPTURE;

  switch (I->getOpcode()) {
  case Instruction::Call:
  case Instruction::Invoke: {
    auto *Call = cast<CallBase>(I);
    // Not captured if the callee is readonly, doesn't return a copy through
    // its return value and doesn't unwind (a readonly function can leak bits
    // by throwing an exception or not depending on the input value).
    if (Call->onlyReadsMemory() && Call->doesNotThrow() &&
        Call->getType()->isVoidTy())
      return UseCaptureKind::NO_CAPTURE;

    // The pointer is not captured if returned pointer is not captured.
    // NOTE: CaptureTracking users should not assume that only functions
    // marked with nocapture do not capture. This means that places like
    // getUnderlyingObject in ValueTracking or DecomposeGEPExpression
    // in BasicAA also need to know about this property.
    if (isIntrinsicReturningPointerAliasingArgumentWithoutCapturing(Call, true))
      return UseCaptureKind::PASSTHROUGH;

    // Volatile operations effectively capture the memory location that they
    // load and store to.
    if (auto *MI = dyn_cast<MemIntrinsic>(Call))
      if (MI->isVolatile())
        return UseCaptureKind::MAY_CAPTURE;

    // Calling a function pointer does not in itself cause the pointer to
    // be captured.  This is a subtle point considering that (for example)
    // the callee might return its own address.  It is analogous to saying
    // that loading a value from a pointer does not cause the pointer to be
    // captured, even though the loaded value might be the pointer itself
    // (think of self-referential objects).
    if (Call->isCallee(&U))
      return UseCaptureKind::NO_CAPTURE;

    // Not captured if only passed via 'nocapture' arguments.
    if (Call->isDataOperand(&U) &&
        !Call->doesNotCapture(Call->getDataOperandNo(&U))) {
      // The parameter is not marked 'nocapture' - captured.
      return UseCaptureKind::MAY_CAPTURE;
    }
    return UseCaptureKind::NO_CAPTURE;
  }
  case Instruction::Load:
    // Volatile loads make the address observable.
    if (cast<LoadInst>(I)->isVolatile())
      return UseCaptureKind::MAY_CAPTURE;
    return UseCaptureKind::NO_CAPTURE;
  case Instruction::VAArg:
    // "va-arg" from a pointer does not cause it to be captured.
    return UseCaptureKind::NO_CAPTURE;
  case Instruction::Store:
    // Stored the pointer - conservatively assume it may be captured.
    // Volatile stores make the address observable.
    if (U.getOperandNo() == 0 || cast<StoreInst>(I)->isVolatile())
      return UseCaptureKind::MAY_CAPTURE;
    return UseCaptureKind::NO_CAPTURE;
  case Instruction::AtomicRMW: {
    // atomicrmw conceptually includes both a load and store from
    // the same location.
    // As with a store, the location being accessed is not captured,
    // but the value being stored is.
    // Volatile stores make the address observable.
    auto *ARMWI = cast<AtomicRMWInst>(I);
    if (U.getOperandNo() == 1 || ARMWI->isVolatile())
      return UseCaptureKind::MAY_CAPTURE;
    return UseCaptureKind::NO_CAPTURE;
  }
  case Instruction::AtomicCmpXchg: {
    // cmpxchg conceptually includes both a load and store from
    // the same location.
    // As with a store, the location being accessed is not captured,
    // but the value being stored is.
    // Volatile stores make the address observable.
    auto *ACXI = cast<AtomicCmpXchgInst>(I);
