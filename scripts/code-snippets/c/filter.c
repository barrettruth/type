double low_pass(double previous, double sample, double alpha) {
  double keep = 1.0 - alpha;
  return previous * keep + sample * alpha;
}
