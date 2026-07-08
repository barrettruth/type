double control_step(double target, double measured, double dt) {
  const double error = target - measured;
  const double damped = error * 0.8 - measured * 0.05;
  return std::clamp(damped * dt, -1.0, 1.0);
}
