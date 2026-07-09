/// The default value for MaxUsesToExplore argument. It's relatively small to
/// keep the cost of analysis reasonable for clients like BasicAliasAnalysis,
/// where the results can't be cached.
/// TODO: we should probably introduce a caching CaptureTracking analysis and
/// use it where possible. The caching version can use much higher limit or
/// don't have this cap at all.
static cl::opt<unsigned>
    DefaultMaxUsesToExplore("capture-tracking-max-uses-to-explore", cl::Hidden,
                            cl::desc("Maximal number of uses to explore."),
                            cl::init(100));

unsigned llvm::getDefaultMaxUsesToExploreForCaptureTracking() {
  return DefaultMaxUsesToExplore;
}

CaptureTracker::~CaptureTracker() = default;

bool CaptureTracker::shouldExplore(const Use *U) { return true; }

bool CaptureTracker::isDereferenceableOrNull(Value *O, const DataLayout &DL) {
  // We want comparisons to null pointers to not be considered capturing,
  // but need to guard against cases like gep(p, -ptrtoint(p2)) == null,
  // which are equivalent to p == p2 and would capture the pointer.
  //
  // A dereferenceable pointer is a case where this is known to be safe,
  // because the pointer resulting from such a construction would not be
  // dereferenceable.
  //
  // It is not sufficient to check for inbounds GEP here, because GEP with
  // zero offset is always inbounds.
  bool CanBeNull, CanBeFreed;
  return O->getPointerDereferenceableBytes(DL, CanBeNull, CanBeFreed);
}

namespace {
struct SimpleCaptureTracker : public CaptureTracker {
  explicit SimpleCaptureTracker(bool ReturnCaptures)
      : ReturnCaptures(ReturnCaptures) {}

  void tooManyUses() override {
    LLVM_DEBUG(dbgs() << "Captured due to too many uses\n");
    Captured = true;
  }

  bool captured(const Use *U) override {
    if (isa<ReturnInst>(U->getUser()) && !ReturnCaptures)
      return false;

    LLVM_DEBUG(dbgs() << "Captured by: " << *U->getUser() << "\n");

    Captured = true;
    return true;
  }

  bool ReturnCaptures;

  bool Captured = false;
};

/// Only find pointer captures which happen before the given instruction. Uses
/// the dominator tree to determine whether one instruction is before another.
/// Only support the case where the Value is defined in the same basic block
/// as the given instruction and the use.
struct CapturesBefore : public CaptureTracker {

  CapturesBefore(bool ReturnCaptures, const Instruction *I,
                 const DominatorTree *DT, bool IncludeI, const LoopInfo *LI)
      : BeforeHere(I), DT(DT), ReturnCaptures(ReturnCaptures),
        IncludeI(IncludeI), LI(LI) {}

  void tooManyUses() override { Captured = true; }

  bool isSafeToPrune(Instruction *I) {
    if (BeforeHere == I)
      return !IncludeI;

    // We explore this usage only if the usage can reach "BeforeHere".
    // If use is not reachable from entry, there is no need to explore.
    if (!DT->isReachableFromEntry(I->getParent()))
      return true;

    // Check whether there is a path from I to BeforeHere.
    return !isPotentiallyReachable(I, BeforeHere, nullptr, DT, LI);
  }

  bool captured(const Use *U) override {
    Instruction *I = cast<Instruction>(U->getUser());
    if (isa<ReturnInst>(I) && !ReturnCaptures)
      return false;

    // Check isSafeToPrune() here rather than in shouldExplore() to avoid
    // an expensive reachability query for every instruction we look at.
    // Instead we only do one for actual capturing candidates.
    if (isSafeToPrune(I))
      return false;

    Captured = true;
    return true;
  }
