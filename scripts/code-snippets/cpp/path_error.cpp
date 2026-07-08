struct Point {
  double x;
  double y;
};

double lateral_error(Point target, Point pose) {
  const double dx = target.x - pose.x;
  const double dy = target.y - pose.y;
  return dx * pose.y - dy * pose.x;
}
