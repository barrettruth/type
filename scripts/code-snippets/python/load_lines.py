from pathlib import Path


def load_lines(path: Path) -> list[str]:
    text = path.read_text()
    return [line.strip() for line in text.splitlines() if line.strip()]
