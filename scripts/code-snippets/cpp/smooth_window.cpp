std::vector<double> smooth(std::span<const double> samples) {
  std::vector<double> result;
  for (double sample : samples) {
    result.push_back(sample * 0.25);
  }
  return result;
}
