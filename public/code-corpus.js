export const codeSnippets = [
  {
    "language": "bash",
    "name": "bash/arrays.bash",
    "code": "set -euo pipefail\n\nitems=(\"alpha\" \"beta\" \"gamma\")\nfor item in \"${items[@]}\"; do\n  printf '%s\\n' \"${item^^}\"\ndone",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-function"
      },
      {
        "start": 4,
        "end": 8,
        "className": "syntax-constant"
      },
      {
        "start": 19,
        "end": 24,
        "className": "syntax-property"
      },
      {
        "start": 26,
        "end": 33,
        "className": "syntax-string"
      },
      {
        "start": 34,
        "end": 40,
        "className": "syntax-string"
      },
      {
        "start": 41,
        "end": 48,
        "className": "syntax-string"
      },
      {
        "start": 50,
        "end": 53,
        "className": "syntax-keyword"
      },
      {
        "start": 54,
        "end": 58,
        "className": "syntax-property"
      },
      {
        "start": 59,
        "end": 61,
        "className": "syntax-keyword"
      },
      {
        "start": 62,
        "end": 75,
        "className": "syntax-string"
      },
      {
        "start": 77,
        "end": 79,
        "className": "syntax-keyword"
      },
      {
        "start": 82,
        "end": 88,
        "className": "syntax-function"
      },
      {
        "start": 89,
        "end": 95,
        "className": "syntax-string"
      },
      {
        "start": 96,
        "end": 107,
        "className": "syntax-string"
      },
      {
        "start": 108,
        "end": 112,
        "className": "syntax-keyword"
      }
    ]
  },
  {
    "language": "bash",
    "name": "bash/case.bash",
    "code": "set -euo pipefail\n\ncase \"${1:-}\" in\nstart) action=run ;;\nstop) action=halt ;;\n*) action=status ;;\nesac\nprintf '%s\\n' \"$action\"",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-function"
      },
      {
        "start": 4,
        "end": 8,
        "className": "syntax-constant"
      },
      {
        "start": 19,
        "end": 23,
        "className": "syntax-keyword"
      },
      {
        "start": 24,
        "end": 32,
        "className": "syntax-string"
      },
      {
        "start": 33,
        "end": 35,
        "className": "syntax-keyword"
      },
      {
        "start": 43,
        "end": 49,
        "className": "syntax-property"
      },
      {
        "start": 63,
        "end": 69,
        "className": "syntax-property"
      },
      {
        "start": 81,
        "end": 87,
        "className": "syntax-property"
      },
      {
        "start": 98,
        "end": 102,
        "className": "syntax-keyword"
      },
      {
        "start": 103,
        "end": 109,
        "className": "syntax-function"
      },
      {
        "start": 110,
        "end": 116,
        "className": "syntax-string"
      },
      {
        "start": 117,
        "end": 126,
        "className": "syntax-string"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/filter.c",
    "code": "double low_pass(double previous, double sample, double alpha) {\n  double keep = 1.0 - alpha;\n  return previous * keep + sample * alpha;\n}",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-type"
      },
      {
        "start": 7,
        "end": 15,
        "className": "syntax-function"
      },
      {
        "start": 16,
        "end": 22,
        "className": "syntax-type"
      },
      {
        "start": 23,
        "end": 31,
        "className": "syntax-variable"
      },
      {
        "start": 33,
        "end": 39,
        "className": "syntax-type"
      },
      {
        "start": 40,
        "end": 46,
        "className": "syntax-variable"
      },
      {
        "start": 48,
        "end": 54,
        "className": "syntax-type"
      },
      {
        "start": 55,
        "end": 60,
        "className": "syntax-variable"
      },
      {
        "start": 66,
        "end": 72,
        "className": "syntax-type"
      },
      {
        "start": 73,
        "end": 77,
        "className": "syntax-variable"
      },
      {
        "start": 78,
        "end": 79,
        "className": "syntax-operator"
      },
      {
        "start": 80,
        "end": 83,
        "className": "syntax-number"
      },
      {
        "start": 84,
        "end": 85,
        "className": "syntax-operator"
      },
      {
        "start": 86,
        "end": 91,
        "className": "syntax-variable"
      },
      {
        "start": 95,
        "end": 101,
        "className": "syntax-keyword"
      },
      {
        "start": 102,
        "end": 110,
        "className": "syntax-variable"
      },
      {
        "start": 111,
        "end": 112,
        "className": "syntax-operator"
      },
      {
        "start": 113,
        "end": 117,
        "className": "syntax-variable"
      },
      {
        "start": 118,
        "end": 119,
        "className": "syntax-operator"
      },
      {
        "start": 120,
        "end": 126,
        "className": "syntax-variable"
      },
      {
        "start": 127,
        "end": 128,
        "className": "syntax-operator"
      },
      {
        "start": 129,
        "end": 134,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/ring_buffer.c",
    "code": "size_t ring_next(size_t index, size_t capacity) {\n  if (capacity == 0) {\n    return 0;\n  }\n  return (index + 1) % capacity;\n}",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-type"
      },
      {
        "start": 7,
        "end": 16,
        "className": "syntax-function"
      },
      {
        "start": 17,
        "end": 23,
        "className": "syntax-type"
      },
      {
        "start": 24,
        "end": 29,
        "className": "syntax-variable"
      },
      {
        "start": 31,
        "end": 37,
        "className": "syntax-type"
      },
      {
        "start": 38,
        "end": 46,
        "className": "syntax-variable"
      },
      {
        "start": 52,
        "end": 54,
        "className": "syntax-keyword"
      },
      {
        "start": 56,
        "end": 64,
        "className": "syntax-variable"
      },
      {
        "start": 65,
        "end": 67,
        "className": "syntax-operator"
      },
      {
        "start": 68,
        "end": 69,
        "className": "syntax-number"
      },
      {
        "start": 77,
        "end": 83,
        "className": "syntax-keyword"
      },
      {
        "start": 84,
        "end": 85,
        "className": "syntax-number"
      },
      {
        "start": 93,
        "end": 99,
        "className": "syntax-keyword"
      },
      {
        "start": 101,
        "end": 106,
        "className": "syntax-variable"
      },
      {
        "start": 107,
        "end": 108,
        "className": "syntax-operator"
      },
      {
        "start": 109,
        "end": 110,
        "className": "syntax-number"
      },
      {
        "start": 114,
        "end": 122,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "cpp",
    "name": "cpp/control_step.cpp",
    "code": "double control_step(double target, double measured, double dt) {\n  const double error = target - measured;\n  const double damped = error * 0.8 - measured * 0.05;\n  return std::clamp(damped * dt, -1.0, 1.0);\n}",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-type"
      },
      {
        "start": 7,
        "end": 19,
        "className": "syntax-function"
      },
      {
        "start": 20,
        "end": 26,
        "className": "syntax-type"
      },
      {
        "start": 27,
        "end": 33,
        "className": "syntax-variable"
      },
      {
        "start": 35,
        "end": 41,
        "className": "syntax-type"
      },
      {
        "start": 42,
        "end": 50,
        "className": "syntax-variable"
      },
      {
        "start": 52,
        "end": 58,
        "className": "syntax-type"
      },
      {
        "start": 59,
        "end": 61,
        "className": "syntax-variable"
      },
      {
        "start": 67,
        "end": 72,
        "className": "syntax-keyword"
      },
      {
        "start": 73,
        "end": 79,
        "className": "syntax-type"
      },
      {
        "start": 80,
        "end": 85,
        "className": "syntax-variable"
      },
      {
        "start": 86,
        "end": 87,
        "className": "syntax-operator"
      },
      {
        "start": 88,
        "end": 94,
        "className": "syntax-variable"
      },
      {
        "start": 95,
        "end": 96,
        "className": "syntax-operator"
      },
      {
        "start": 97,
        "end": 105,
        "className": "syntax-variable"
      },
      {
        "start": 109,
        "end": 114,
        "className": "syntax-keyword"
      },
      {
        "start": 115,
        "end": 121,
        "className": "syntax-type"
      },
      {
        "start": 122,
        "end": 128,
        "className": "syntax-variable"
      },
      {
        "start": 129,
        "end": 130,
        "className": "syntax-operator"
      },
      {
        "start": 131,
        "end": 136,
        "className": "syntax-variable"
      },
      {
        "start": 137,
        "end": 138,
        "className": "syntax-operator"
      },
      {
        "start": 139,
        "end": 142,
        "className": "syntax-number"
      },
      {
        "start": 143,
        "end": 144,
        "className": "syntax-operator"
      },
      {
        "start": 145,
        "end": 153,
        "className": "syntax-variable"
      },
      {
        "start": 154,
        "end": 155,
        "className": "syntax-operator"
      },
      {
        "start": 156,
        "end": 160,
        "className": "syntax-number"
      },
      {
        "start": 164,
        "end": 170,
        "className": "syntax-keyword"
      },
      {
        "start": 176,
        "end": 181,
        "className": "syntax-function"
      },
      {
        "start": 182,
        "end": 188,
        "className": "syntax-variable"
      },
      {
        "start": 189,
        "end": 190,
        "className": "syntax-operator"
      },
      {
        "start": 191,
        "end": 193,
        "className": "syntax-variable"
      },
      {
        "start": 195,
        "end": 199,
        "className": "syntax-number"
      },
      {
        "start": 201,
        "end": 204,
        "className": "syntax-number"
      }
    ]
  },
  {
    "language": "cpp",
    "name": "cpp/path_error.cpp",
    "code": "struct Point {\n  double x;\n  double y;\n};\n\ndouble lateral_error(Point target, Point pose) {\n  const double dx = target.x - pose.x;\n  const double dy = target.y - pose.y;\n  return dx * pose.y - dy * pose.x;\n}",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-keyword"
      },
      {
        "start": 7,
        "end": 12,
        "className": "syntax-type"
      },
      {
        "start": 17,
        "end": 23,
        "className": "syntax-type"
      },
      {
        "start": 24,
        "end": 25,
        "className": "syntax-property"
      },
      {
        "start": 29,
        "end": 35,
        "className": "syntax-type"
      },
      {
        "start": 36,
        "end": 37,
        "className": "syntax-property"
      },
      {
        "start": 43,
        "end": 49,
        "className": "syntax-type"
      },
      {
        "start": 50,
        "end": 63,
        "className": "syntax-function"
      },
      {
        "start": 64,
        "end": 69,
        "className": "syntax-type"
      },
      {
        "start": 70,
        "end": 76,
        "className": "syntax-variable"
      },
      {
        "start": 78,
        "end": 83,
        "className": "syntax-type"
      },
      {
        "start": 84,
        "end": 88,
        "className": "syntax-variable"
      },
      {
        "start": 94,
        "end": 99,
        "className": "syntax-keyword"
      },
      {
        "start": 100,
        "end": 106,
        "className": "syntax-type"
      },
      {
        "start": 107,
        "end": 109,
        "className": "syntax-variable"
      },
      {
        "start": 110,
        "end": 111,
        "className": "syntax-operator"
      },
      {
        "start": 112,
        "end": 118,
        "className": "syntax-variable"
      },
      {
        "start": 119,
        "end": 120,
        "className": "syntax-property"
      },
      {
        "start": 121,
        "end": 122,
        "className": "syntax-operator"
      },
      {
        "start": 123,
        "end": 127,
        "className": "syntax-variable"
      },
      {
        "start": 128,
        "end": 129,
        "className": "syntax-property"
      },
      {
        "start": 133,
        "end": 138,
        "className": "syntax-keyword"
      },
      {
        "start": 139,
        "end": 145,
        "className": "syntax-type"
      },
      {
        "start": 146,
        "end": 148,
        "className": "syntax-variable"
      },
      {
        "start": 149,
        "end": 150,
        "className": "syntax-operator"
      },
      {
        "start": 151,
        "end": 157,
        "className": "syntax-variable"
      },
      {
        "start": 158,
        "end": 159,
        "className": "syntax-property"
      },
      {
        "start": 160,
        "end": 161,
        "className": "syntax-operator"
      },
      {
        "start": 162,
        "end": 166,
        "className": "syntax-variable"
      },
      {
        "start": 167,
        "end": 168,
        "className": "syntax-property"
      },
      {
        "start": 172,
        "end": 178,
        "className": "syntax-keyword"
      },
      {
        "start": 179,
        "end": 181,
        "className": "syntax-variable"
      },
      {
        "start": 182,
        "end": 183,
        "className": "syntax-operator"
      },
      {
        "start": 184,
        "end": 188,
        "className": "syntax-variable"
      },
      {
        "start": 189,
        "end": 190,
        "className": "syntax-property"
      },
      {
        "start": 191,
        "end": 192,
        "className": "syntax-operator"
      },
      {
        "start": 193,
        "end": 195,
        "className": "syntax-variable"
      },
      {
        "start": 196,
        "end": 197,
        "className": "syntax-operator"
      },
      {
        "start": 198,
        "end": 202,
        "className": "syntax-variable"
      },
      {
        "start": 203,
        "end": 204,
        "className": "syntax-property"
      }
    ]
  },
  {
    "language": "cpp",
    "name": "cpp/smooth_window.cpp",
    "code": "std::vector<double> smooth(std::span<const double> samples) {\n  std::vector<double> result;\n  for (double sample : samples) {\n    result.push_back(sample * 0.25);\n  }\n  return result;\n}",
    "spans": [
      {
        "start": 5,
        "end": 11,
        "className": "syntax-type"
      },
      {
        "start": 11,
        "end": 12,
        "className": "syntax-operator"
      },
      {
        "start": 12,
        "end": 18,
        "className": "syntax-type"
      },
      {
        "start": 18,
        "end": 19,
        "className": "syntax-operator"
      },
      {
        "start": 20,
        "end": 26,
        "className": "syntax-function"
      },
      {
        "start": 32,
        "end": 36,
        "className": "syntax-type"
      },
      {
        "start": 36,
        "end": 37,
        "className": "syntax-operator"
      },
      {
        "start": 37,
        "end": 42,
        "className": "syntax-keyword"
      },
      {
        "start": 43,
        "end": 49,
        "className": "syntax-type"
      },
      {
        "start": 49,
        "end": 50,
        "className": "syntax-operator"
      },
      {
        "start": 51,
        "end": 58,
        "className": "syntax-variable"
      },
      {
        "start": 69,
        "end": 75,
        "className": "syntax-type"
      },
      {
        "start": 75,
        "end": 76,
        "className": "syntax-operator"
      },
      {
        "start": 76,
        "end": 82,
        "className": "syntax-type"
      },
      {
        "start": 82,
        "end": 83,
        "className": "syntax-operator"
      },
      {
        "start": 84,
        "end": 90,
        "className": "syntax-variable"
      },
      {
        "start": 94,
        "end": 97,
        "className": "syntax-keyword"
      },
      {
        "start": 99,
        "end": 105,
        "className": "syntax-type"
      },
      {
        "start": 106,
        "end": 112,
        "className": "syntax-variable"
      },
      {
        "start": 115,
        "end": 122,
        "className": "syntax-variable"
      },
      {
        "start": 130,
        "end": 136,
        "className": "syntax-variable"
      },
      {
        "start": 137,
        "end": 146,
        "className": "syntax-function"
      },
      {
        "start": 147,
        "end": 153,
        "className": "syntax-variable"
      },
      {
        "start": 154,
        "end": 155,
        "className": "syntax-operator"
      },
      {
        "start": 156,
        "end": 160,
        "className": "syntax-number"
      },
      {
        "start": 169,
        "end": 175,
        "className": "syntax-keyword"
      },
      {
        "start": 176,
        "end": 182,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "css",
    "name": "css/card.css",
    "code": ".card {\n  display: grid;\n  gap: 0.75rem;\n  padding: 1rem;\n  border-radius: 0.5rem;\n}",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 1,
        "end": 5,
        "className": "syntax-property"
      },
      {
        "start": 6,
        "end": 7,
        "className": "syntax-punctuation"
      },
      {
        "start": 10,
        "end": 17,
        "className": "syntax-property"
      },
      {
        "start": 17,
        "end": 18,
        "className": "syntax-punctuation"
      },
      {
        "start": 23,
        "end": 24,
        "className": "syntax-punctuation"
      },
      {
        "start": 27,
        "end": 30,
        "className": "syntax-property"
      },
      {
        "start": 30,
        "end": 31,
        "className": "syntax-punctuation"
      },
      {
        "start": 32,
        "end": 39,
        "className": "syntax-number"
      },
      {
        "start": 39,
        "end": 40,
        "className": "syntax-punctuation"
      },
      {
        "start": 43,
        "end": 50,
        "className": "syntax-property"
      },
      {
        "start": 50,
        "end": 51,
        "className": "syntax-punctuation"
      },
      {
        "start": 52,
        "end": 56,
        "className": "syntax-number"
      },
      {
        "start": 56,
        "end": 57,
        "className": "syntax-punctuation"
      },
      {
        "start": 60,
        "end": 73,
        "className": "syntax-property"
      },
      {
        "start": 73,
        "end": 74,
        "className": "syntax-punctuation"
      },
      {
        "start": 75,
        "end": 81,
        "className": "syntax-number"
      },
      {
        "start": 81,
        "end": 82,
        "className": "syntax-punctuation"
      },
      {
        "start": 83,
        "end": 84,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "css",
    "name": "css/layout.css",
    "code": ".layout {\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 1.5rem;\n}",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 1,
        "end": 7,
        "className": "syntax-property"
      },
      {
        "start": 8,
        "end": 9,
        "className": "syntax-punctuation"
      },
      {
        "start": 12,
        "end": 33,
        "className": "syntax-property"
      },
      {
        "start": 33,
        "end": 34,
        "className": "syntax-punctuation"
      },
      {
        "start": 35,
        "end": 41,
        "className": "syntax-function"
      },
      {
        "start": 41,
        "end": 42,
        "className": "syntax-punctuation"
      },
      {
        "start": 42,
        "end": 43,
        "className": "syntax-number"
      },
      {
        "start": 43,
        "end": 44,
        "className": "syntax-punctuation"
      },
      {
        "start": 45,
        "end": 48,
        "className": "syntax-number"
      },
      {
        "start": 48,
        "end": 49,
        "className": "syntax-punctuation"
      },
      {
        "start": 54,
        "end": 55,
        "className": "syntax-punctuation"
      },
      {
        "start": 58,
        "end": 69,
        "className": "syntax-property"
      },
      {
        "start": 69,
        "end": 70,
        "className": "syntax-punctuation"
      },
      {
        "start": 77,
        "end": 78,
        "className": "syntax-punctuation"
      },
      {
        "start": 81,
        "end": 91,
        "className": "syntax-property"
      },
      {
        "start": 91,
        "end": 92,
        "className": "syntax-punctuation"
      },
      {
        "start": 93,
        "end": 99,
        "className": "syntax-number"
      },
      {
        "start": 99,
        "end": 100,
        "className": "syntax-punctuation"
      },
      {
        "start": 101,
        "end": 102,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "html",
    "name": "html/card.html",
    "code": "<article class=\"card\">\n  <h2>Practice</h2>\n  <p>Type each line with steady rhythm.</p>\n</article>",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 1,
        "end": 8,
        "className": "syntax-tag"
      },
      {
        "start": 9,
        "end": 14,
        "className": "syntax-attribute"
      },
      {
        "start": 16,
        "end": 20,
        "className": "syntax-string"
      },
      {
        "start": 21,
        "end": 22,
        "className": "syntax-punctuation"
      },
      {
        "start": 25,
        "end": 26,
        "className": "syntax-punctuation"
      },
      {
        "start": 26,
        "end": 28,
        "className": "syntax-tag"
      },
      {
        "start": 28,
        "end": 29,
        "className": "syntax-punctuation"
      },
      {
        "start": 37,
        "end": 39,
        "className": "syntax-punctuation"
      },
      {
        "start": 39,
        "end": 41,
        "className": "syntax-tag"
      },
      {
        "start": 41,
        "end": 42,
        "className": "syntax-punctuation"
      },
      {
        "start": 45,
        "end": 46,
        "className": "syntax-punctuation"
      },
      {
        "start": 46,
        "end": 47,
        "className": "syntax-tag"
      },
      {
        "start": 47,
        "end": 48,
        "className": "syntax-punctuation"
      },
      {
        "start": 82,
        "end": 84,
        "className": "syntax-punctuation"
      },
      {
        "start": 84,
        "end": 85,
        "className": "syntax-tag"
      },
      {
        "start": 85,
        "end": 86,
        "className": "syntax-punctuation"
      },
      {
        "start": 87,
        "end": 89,
        "className": "syntax-punctuation"
      },
      {
        "start": 89,
        "end": 96,
        "className": "syntax-tag"
      },
      {
        "start": 96,
        "end": 97,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "html",
    "name": "html/form.html",
    "code": "<form class=\"search\" action=\"/search\">\n  <label for=\"query\">Query</label>\n  <input id=\"query\" name=\"q\" />\n</form>",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 1,
        "end": 5,
        "className": "syntax-tag"
      },
      {
        "start": 6,
        "end": 11,
        "className": "syntax-attribute"
      },
      {
        "start": 13,
        "end": 19,
        "className": "syntax-string"
      },
      {
        "start": 21,
        "end": 27,
        "className": "syntax-attribute"
      },
      {
        "start": 29,
        "end": 36,
        "className": "syntax-string"
      },
      {
        "start": 37,
        "end": 38,
        "className": "syntax-punctuation"
      },
      {
        "start": 41,
        "end": 42,
        "className": "syntax-punctuation"
      },
      {
        "start": 42,
        "end": 47,
        "className": "syntax-tag"
      },
      {
        "start": 48,
        "end": 51,
        "className": "syntax-attribute"
      },
      {
        "start": 53,
        "end": 58,
        "className": "syntax-string"
      },
      {
        "start": 59,
        "end": 60,
        "className": "syntax-punctuation"
      },
      {
        "start": 65,
        "end": 67,
        "className": "syntax-punctuation"
      },
      {
        "start": 67,
        "end": 72,
        "className": "syntax-tag"
      },
      {
        "start": 72,
        "end": 73,
        "className": "syntax-punctuation"
      },
      {
        "start": 76,
        "end": 77,
        "className": "syntax-punctuation"
      },
      {
        "start": 77,
        "end": 82,
        "className": "syntax-tag"
      },
      {
        "start": 83,
        "end": 85,
        "className": "syntax-attribute"
      },
      {
        "start": 87,
        "end": 92,
        "className": "syntax-string"
      },
      {
        "start": 94,
        "end": 98,
        "className": "syntax-attribute"
      },
      {
        "start": 100,
        "end": 101,
        "className": "syntax-string"
      },
      {
        "start": 103,
        "end": 105,
        "className": "syntax-punctuation"
      },
      {
        "start": 106,
        "end": 108,
        "className": "syntax-punctuation"
      },
      {
        "start": 108,
        "end": 112,
        "className": "syntax-tag"
      },
      {
        "start": 112,
        "end": 113,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "javascript",
    "name": "javascript/render.js",
    "code": "function render(items) {\n  return items.map((item) => String(item.label)).join(\", \");\n}",
    "spans": [
      {
        "start": 0,
        "end": 8,
        "className": "syntax-keyword"
      },
      {
        "start": 9,
        "end": 15,
        "className": "syntax-function"
      },
      {
        "start": 15,
        "end": 16,
        "className": "syntax-punctuation"
      },
      {
        "start": 16,
        "end": 21,
        "className": "syntax-variable"
      },
      {
        "start": 21,
        "end": 22,
        "className": "syntax-punctuation"
      },
      {
        "start": 23,
        "end": 24,
        "className": "syntax-punctuation"
      },
      {
        "start": 27,
        "end": 33,
        "className": "syntax-keyword"
      },
      {
        "start": 34,
        "end": 39,
        "className": "syntax-variable"
      },
      {
        "start": 39,
        "end": 40,
        "className": "syntax-punctuation"
      },
      {
        "start": 40,
        "end": 43,
        "className": "syntax-function"
      },
      {
        "start": 43,
        "end": 45,
        "className": "syntax-punctuation"
      },
      {
        "start": 45,
        "end": 49,
        "className": "syntax-variable"
      },
      {
        "start": 49,
        "end": 50,
        "className": "syntax-punctuation"
      },
      {
        "start": 51,
        "end": 53,
        "className": "syntax-operator"
      },
      {
        "start": 54,
        "end": 60,
        "className": "syntax-type"
      },
      {
        "start": 60,
        "end": 61,
        "className": "syntax-punctuation"
      },
      {
        "start": 61,
        "end": 65,
        "className": "syntax-variable"
      },
      {
        "start": 65,
        "end": 66,
        "className": "syntax-punctuation"
      },
      {
        "start": 66,
        "end": 71,
        "className": "syntax-property"
      },
      {
        "start": 71,
        "end": 74,
        "className": "syntax-punctuation"
      },
      {
        "start": 74,
        "end": 78,
        "className": "syntax-function"
      },
      {
        "start": 78,
        "end": 79,
        "className": "syntax-punctuation"
      },
      {
        "start": 79,
        "end": 83,
        "className": "syntax-string"
      },
      {
        "start": 83,
        "end": 85,
        "className": "syntax-punctuation"
      },
      {
        "start": 86,
        "end": 87,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "javascript",
    "name": "javascript/state.js",
    "code": "const nextState = {\n  cursor: state.cursor + 1,\n  errors: state.errors,\n  active: true,\n};",
    "spans": [
      {
        "start": 0,
        "end": 5,
        "className": "syntax-keyword"
      },
      {
        "start": 6,
        "end": 15,
        "className": "syntax-variable"
      },
      {
        "start": 16,
        "end": 17,
        "className": "syntax-operator"
      },
      {
        "start": 18,
        "end": 19,
        "className": "syntax-punctuation"
      },
      {
        "start": 22,
        "end": 28,
        "className": "syntax-property"
      },
      {
        "start": 30,
        "end": 35,
        "className": "syntax-variable"
      },
      {
        "start": 35,
        "end": 36,
        "className": "syntax-punctuation"
      },
      {
        "start": 36,
        "end": 42,
        "className": "syntax-property"
      },
      {
        "start": 43,
        "end": 44,
        "className": "syntax-operator"
      },
      {
        "start": 45,
        "end": 46,
        "className": "syntax-number"
      },
      {
        "start": 46,
        "end": 47,
        "className": "syntax-punctuation"
      },
      {
        "start": 50,
        "end": 56,
        "className": "syntax-property"
      },
      {
        "start": 58,
        "end": 63,
        "className": "syntax-variable"
      },
      {
        "start": 63,
        "end": 64,
        "className": "syntax-punctuation"
      },
      {
        "start": 64,
        "end": 70,
        "className": "syntax-property"
      },
      {
        "start": 70,
        "end": 71,
        "className": "syntax-punctuation"
      },
      {
        "start": 74,
        "end": 80,
        "className": "syntax-property"
      },
      {
        "start": 82,
        "end": 86,
        "className": "syntax-constant"
      },
      {
        "start": 86,
        "end": 87,
        "className": "syntax-punctuation"
      },
      {
        "start": 88,
        "end": 90,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/clamp.lua",
    "code": "local function clamp(value, low, high)\n  return math.min(math.max(value, low), high)\nend\n\nreturn clamp",
    "spans": [
      {
        "start": 0,
        "end": 5,
        "className": "syntax-keyword"
      },
      {
        "start": 6,
        "end": 14,
        "className": "syntax-keyword"
      },
      {
        "start": 15,
        "end": 20,
        "className": "syntax-function"
      },
      {
        "start": 20,
        "end": 21,
        "className": "syntax-punctuation"
      },
      {
        "start": 26,
        "end": 27,
        "className": "syntax-punctuation"
      },
      {
        "start": 31,
        "end": 32,
        "className": "syntax-punctuation"
      },
      {
        "start": 37,
        "end": 38,
        "className": "syntax-punctuation"
      },
      {
        "start": 41,
        "end": 47,
        "className": "syntax-keyword"
      },
      {
        "start": 48,
        "end": 52,
        "className": "syntax-variable"
      },
      {
        "start": 52,
        "end": 53,
        "className": "syntax-punctuation"
      },
      {
        "start": 53,
        "end": 56,
        "className": "syntax-function"
      },
      {
        "start": 56,
        "end": 57,
        "className": "syntax-punctuation"
      },
      {
        "start": 57,
        "end": 61,
        "className": "syntax-variable"
      },
      {
        "start": 61,
        "end": 62,
        "className": "syntax-punctuation"
      },
      {
        "start": 62,
        "end": 65,
        "className": "syntax-function"
      },
      {
        "start": 65,
        "end": 66,
        "className": "syntax-punctuation"
      },
      {
        "start": 66,
        "end": 71,
        "className": "syntax-variable"
      },
      {
        "start": 71,
        "end": 72,
        "className": "syntax-punctuation"
      },
      {
        "start": 73,
        "end": 76,
        "className": "syntax-variable"
      },
      {
        "start": 76,
        "end": 78,
        "className": "syntax-punctuation"
      },
      {
        "start": 79,
        "end": 83,
        "className": "syntax-variable"
      },
      {
        "start": 83,
        "end": 84,
        "className": "syntax-punctuation"
      },
      {
        "start": 85,
        "end": 88,
        "className": "syntax-keyword"
      },
      {
        "start": 90,
        "end": 96,
        "className": "syntax-keyword"
      },
      {
        "start": 97,
        "end": 102,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/format_key.lua",
    "code": "local map = vim.keymap.set\n\nmap(\"n\", \"<leader>f\", function()\n  vim.lsp.buf.format({ async = true })\nend)",
    "spans": [
      {
        "start": 0,
        "end": 5,
        "className": "syntax-keyword"
      },
      {
        "start": 6,
        "end": 9,
        "className": "syntax-variable"
      },
      {
        "start": 10,
        "end": 11,
        "className": "syntax-operator"
      },
      {
        "start": 12,
        "end": 15,
        "className": "syntax-variable"
      },
      {
        "start": 15,
        "end": 16,
        "className": "syntax-punctuation"
      },
      {
        "start": 22,
        "end": 23,
        "className": "syntax-punctuation"
      },
      {
        "start": 28,
        "end": 31,
        "className": "syntax-variable"
      },
      {
        "start": 31,
        "end": 32,
        "className": "syntax-punctuation"
      },
      {
        "start": 32,
        "end": 35,
        "className": "syntax-string"
      },
      {
        "start": 35,
        "end": 36,
        "className": "syntax-punctuation"
      },
      {
        "start": 37,
        "end": 48,
        "className": "syntax-string"
      },
      {
        "start": 48,
        "end": 49,
        "className": "syntax-punctuation"
      },
      {
        "start": 50,
        "end": 58,
        "className": "syntax-keyword"
      },
      {
        "start": 58,
        "end": 60,
        "className": "syntax-punctuation"
      },
      {
        "start": 63,
        "end": 66,
        "className": "syntax-variable"
      },
      {
        "start": 66,
        "end": 67,
        "className": "syntax-punctuation"
      },
      {
        "start": 70,
        "end": 71,
        "className": "syntax-punctuation"
      },
      {
        "start": 74,
        "end": 75,
        "className": "syntax-punctuation"
      },
      {
        "start": 75,
        "end": 81,
        "className": "syntax-function"
      },
      {
        "start": 81,
        "end": 82,
        "className": "syntax-punctuation"
      },
      {
        "start": 82,
        "end": 83,
        "className": "syntax-type"
      },
      {
        "start": 90,
        "end": 91,
        "className": "syntax-operator"
      },
      {
        "start": 97,
        "end": 98,
        "className": "syntax-type"
      },
      {
        "start": 98,
        "end": 99,
        "className": "syntax-punctuation"
      },
      {
        "start": 100,
        "end": 103,
        "className": "syntax-keyword"
      },
      {
        "start": 103,
        "end": 104,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/statusline.lua",
    "code": "local function statusline(mode, file)\n  local parts = { mode, file.name, tostring(file.line) }\n  return table.concat(parts, \" \")\nend\n\nreturn statusline",
    "spans": [
      {
        "start": 0,
        "end": 5,
        "className": "syntax-keyword"
      },
      {
        "start": 6,
        "end": 14,
        "className": "syntax-keyword"
      },
      {
        "start": 15,
        "end": 25,
        "className": "syntax-function"
      },
      {
        "start": 25,
        "end": 26,
        "className": "syntax-punctuation"
      },
      {
        "start": 30,
        "end": 31,
        "className": "syntax-punctuation"
      },
      {
        "start": 36,
        "end": 37,
        "className": "syntax-punctuation"
      },
      {
        "start": 40,
        "end": 45,
        "className": "syntax-keyword"
      },
      {
        "start": 46,
        "end": 51,
        "className": "syntax-variable"
      },
      {
        "start": 52,
        "end": 53,
        "className": "syntax-operator"
      },
      {
        "start": 54,
        "end": 55,
        "className": "syntax-type"
      },
      {
        "start": 56,
        "end": 60,
        "className": "syntax-variable"
      },
      {
        "start": 60,
        "end": 61,
        "className": "syntax-punctuation"
      },
      {
        "start": 62,
        "end": 66,
        "className": "syntax-variable"
      },
      {
        "start": 66,
        "end": 67,
        "className": "syntax-punctuation"
      },
      {
        "start": 71,
        "end": 72,
        "className": "syntax-punctuation"
      },
      {
        "start": 73,
        "end": 81,
        "className": "syntax-function"
      },
      {
        "start": 81,
        "end": 82,
        "className": "syntax-punctuation"
      },
      {
        "start": 82,
        "end": 86,
        "className": "syntax-variable"
      },
      {
        "start": 86,
        "end": 87,
        "className": "syntax-punctuation"
      },
      {
        "start": 91,
        "end": 92,
        "className": "syntax-punctuation"
      },
      {
        "start": 93,
        "end": 94,
        "className": "syntax-type"
      },
      {
        "start": 97,
        "end": 103,
        "className": "syntax-keyword"
      },
      {
        "start": 104,
        "end": 109,
        "className": "syntax-variable"
      },
      {
        "start": 109,
        "end": 110,
        "className": "syntax-punctuation"
      },
      {
        "start": 110,
        "end": 116,
        "className": "syntax-function"
      },
      {
        "start": 116,
        "end": 117,
        "className": "syntax-punctuation"
      },
      {
        "start": 117,
        "end": 122,
        "className": "syntax-variable"
      },
      {
        "start": 122,
        "end": 123,
        "className": "syntax-punctuation"
      },
      {
        "start": 124,
        "end": 127,
        "className": "syntax-string"
      },
      {
        "start": 127,
        "end": 128,
        "className": "syntax-punctuation"
      },
      {
        "start": 129,
        "end": 132,
        "className": "syntax-keyword"
      },
      {
        "start": 134,
        "end": 140,
        "className": "syntax-keyword"
      },
      {
        "start": 141,
        "end": 151,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "nix",
    "name": "nix/devshell.nix",
    "code": "{ pkgs }:\n\npkgs.mkShell {\n  packages = [\n    pkgs.just\n    pkgs.tree-sitter\n  ];\n}",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 2,
        "end": 6,
        "className": "syntax-variable"
      },
      {
        "start": 7,
        "end": 8,
        "className": "syntax-punctuation"
      },
      {
        "start": 11,
        "end": 15,
        "className": "syntax-variable"
      },
      {
        "start": 15,
        "end": 16,
        "className": "syntax-punctuation"
      },
      {
        "start": 16,
        "end": 23,
        "className": "syntax-property"
      },
      {
        "start": 24,
        "end": 25,
        "className": "syntax-punctuation"
      },
      {
        "start": 28,
        "end": 36,
        "className": "syntax-property"
      },
      {
        "start": 37,
        "end": 38,
        "className": "syntax-punctuation"
      },
      {
        "start": 39,
        "end": 40,
        "className": "syntax-punctuation"
      },
      {
        "start": 45,
        "end": 49,
        "className": "syntax-variable"
      },
      {
        "start": 49,
        "end": 50,
        "className": "syntax-punctuation"
      },
      {
        "start": 50,
        "end": 54,
        "className": "syntax-property"
      },
      {
        "start": 59,
        "end": 63,
        "className": "syntax-variable"
      },
      {
        "start": 63,
        "end": 64,
        "className": "syntax-punctuation"
      },
      {
        "start": 64,
        "end": 75,
        "className": "syntax-property"
      },
      {
        "start": 78,
        "end": 80,
        "className": "syntax-punctuation"
      },
      {
        "start": 81,
        "end": 82,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "nix",
    "name": "nix/options.nix",
    "code": "{ lib, config, ... }:\n\n{\n  options.services.site.enable = lib.mkEnableOption \"site\";\n  config.services.nginx.enable = config.services.site.enable;\n}",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 2,
        "end": 5,
        "className": "syntax-variable"
      },
      {
        "start": 5,
        "end": 6,
        "className": "syntax-punctuation"
      },
      {
        "start": 7,
        "end": 13,
        "className": "syntax-variable"
      },
      {
        "start": 13,
        "end": 14,
        "className": "syntax-punctuation"
      },
      {
        "start": 19,
        "end": 20,
        "className": "syntax-punctuation"
      },
      {
        "start": 23,
        "end": 24,
        "className": "syntax-punctuation"
      },
      {
        "start": 27,
        "end": 34,
        "className": "syntax-property"
      },
      {
        "start": 34,
        "end": 35,
        "className": "syntax-punctuation"
      },
      {
        "start": 35,
        "end": 43,
        "className": "syntax-property"
      },
      {
        "start": 43,
        "end": 44,
        "className": "syntax-punctuation"
      },
      {
        "start": 44,
        "end": 48,
        "className": "syntax-property"
      },
      {
        "start": 48,
        "end": 49,
        "className": "syntax-punctuation"
      },
      {
        "start": 49,
        "end": 55,
        "className": "syntax-property"
      },
      {
        "start": 56,
        "end": 57,
        "className": "syntax-punctuation"
      },
      {
        "start": 58,
        "end": 61,
        "className": "syntax-variable"
      },
      {
        "start": 61,
        "end": 62,
        "className": "syntax-punctuation"
      },
      {
        "start": 62,
        "end": 76,
        "className": "syntax-property"
      },
      {
        "start": 77,
        "end": 83,
        "className": "syntax-string"
      },
      {
        "start": 83,
        "end": 84,
        "className": "syntax-punctuation"
      },
      {
        "start": 87,
        "end": 93,
        "className": "syntax-property"
      },
      {
        "start": 93,
        "end": 94,
        "className": "syntax-punctuation"
      },
      {
        "start": 94,
        "end": 102,
        "className": "syntax-property"
      },
      {
        "start": 102,
        "end": 103,
        "className": "syntax-punctuation"
      },
      {
        "start": 103,
        "end": 108,
        "className": "syntax-property"
      },
      {
        "start": 108,
        "end": 109,
        "className": "syntax-punctuation"
      },
      {
        "start": 109,
        "end": 115,
        "className": "syntax-property"
      },
      {
        "start": 116,
        "end": 117,
        "className": "syntax-punctuation"
      },
      {
        "start": 118,
        "end": 124,
        "className": "syntax-variable"
      },
      {
        "start": 124,
        "end": 125,
        "className": "syntax-punctuation"
      },
      {
        "start": 125,
        "end": 133,
        "className": "syntax-property"
      },
      {
        "start": 133,
        "end": 134,
        "className": "syntax-punctuation"
      },
      {
        "start": 134,
        "end": 138,
        "className": "syntax-property"
      },
      {
        "start": 138,
        "end": 139,
        "className": "syntax-punctuation"
      },
      {
        "start": 139,
        "end": 145,
        "className": "syntax-property"
      },
      {
        "start": 145,
        "end": 146,
        "className": "syntax-punctuation"
      },
      {
        "start": 147,
        "end": 148,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "python",
    "name": "python/batches.py",
    "code": "def batches(items: list[str], size: int) -> list[list[str]]:\n    return [items[index : index + size] for index in range(0, len(items), size)]",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-keyword"
      },
      {
        "start": 4,
        "end": 11,
        "className": "syntax-function"
      },
      {
        "start": 12,
        "end": 17,
        "className": "syntax-variable"
      },
      {
        "start": 19,
        "end": 23,
        "className": "syntax-variable"
      },
      {
        "start": 24,
        "end": 27,
        "className": "syntax-type"
      },
      {
        "start": 30,
        "end": 34,
        "className": "syntax-variable"
      },
      {
        "start": 36,
        "end": 39,
        "className": "syntax-type"
      },
      {
        "start": 41,
        "end": 43,
        "className": "syntax-operator"
      },
      {
        "start": 44,
        "end": 48,
        "className": "syntax-variable"
      },
      {
        "start": 49,
        "end": 53,
        "className": "syntax-variable"
      },
      {
        "start": 54,
        "end": 57,
        "className": "syntax-type"
      },
      {
        "start": 65,
        "end": 71,
        "className": "syntax-keyword"
      },
      {
        "start": 73,
        "end": 78,
        "className": "syntax-variable"
      },
      {
        "start": 79,
        "end": 84,
        "className": "syntax-variable"
      },
      {
        "start": 87,
        "end": 92,
        "className": "syntax-variable"
      },
      {
        "start": 93,
        "end": 94,
        "className": "syntax-operator"
      },
      {
        "start": 95,
        "end": 99,
        "className": "syntax-variable"
      },
      {
        "start": 101,
        "end": 104,
        "className": "syntax-keyword"
      },
      {
        "start": 105,
        "end": 110,
        "className": "syntax-variable"
      },
      {
        "start": 111,
        "end": 113,
        "className": "syntax-operator"
      },
      {
        "start": 114,
        "end": 119,
        "className": "syntax-function"
      },
      {
        "start": 120,
        "end": 121,
        "className": "syntax-number"
      },
      {
        "start": 123,
        "end": 126,
        "className": "syntax-function"
      },
      {
        "start": 127,
        "end": 132,
        "className": "syntax-variable"
      },
      {
        "start": 135,
        "end": 139,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "python",
    "name": "python/clamp.py",
    "code": "def clamp(value: float, low: float, high: float) -> float:\n    return min(max(value, low), high)\n\n\ndef normalized_error(target: float, measured: float) -> float:\n    return clamp(target - measured, -1.0, 1.0)",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-keyword"
      },
      {
        "start": 4,
        "end": 9,
        "className": "syntax-function"
      },
      {
        "start": 10,
        "end": 15,
        "className": "syntax-variable"
      },
      {
        "start": 17,
        "end": 22,
        "className": "syntax-type"
      },
      {
        "start": 24,
        "end": 27,
        "className": "syntax-variable"
      },
      {
        "start": 29,
        "end": 34,
        "className": "syntax-type"
      },
      {
        "start": 36,
        "end": 40,
        "className": "syntax-variable"
      },
      {
        "start": 42,
        "end": 47,
        "className": "syntax-type"
      },
      {
        "start": 49,
        "end": 51,
        "className": "syntax-operator"
      },
      {
        "start": 52,
        "end": 57,
        "className": "syntax-type"
      },
      {
        "start": 63,
        "end": 69,
        "className": "syntax-keyword"
      },
      {
        "start": 70,
        "end": 73,
        "className": "syntax-function"
      },
      {
        "start": 74,
        "end": 77,
        "className": "syntax-function"
      },
      {
        "start": 78,
        "end": 83,
        "className": "syntax-variable"
      },
      {
        "start": 85,
        "end": 88,
        "className": "syntax-variable"
      },
      {
        "start": 91,
        "end": 95,
        "className": "syntax-variable"
      },
      {
        "start": 99,
        "end": 102,
        "className": "syntax-keyword"
      },
      {
        "start": 103,
        "end": 119,
        "className": "syntax-function"
      },
      {
        "start": 120,
        "end": 126,
        "className": "syntax-variable"
      },
      {
        "start": 128,
        "end": 133,
        "className": "syntax-type"
      },
      {
        "start": 135,
        "end": 143,
        "className": "syntax-variable"
      },
      {
        "start": 145,
        "end": 150,
        "className": "syntax-type"
      },
      {
        "start": 152,
        "end": 154,
        "className": "syntax-operator"
      },
      {
        "start": 155,
        "end": 160,
        "className": "syntax-type"
      },
      {
        "start": 166,
        "end": 172,
        "className": "syntax-keyword"
      },
      {
        "start": 173,
        "end": 178,
        "className": "syntax-function"
      },
      {
        "start": 179,
        "end": 185,
        "className": "syntax-variable"
      },
      {
        "start": 186,
        "end": 187,
        "className": "syntax-operator"
      },
      {
        "start": 188,
        "end": 196,
        "className": "syntax-variable"
      },
      {
        "start": 198,
        "end": 199,
        "className": "syntax-operator"
      },
      {
        "start": 199,
        "end": 202,
        "className": "syntax-number"
      },
      {
        "start": 204,
        "end": 207,
        "className": "syntax-number"
      }
    ]
  },
  {
    "language": "python",
    "name": "python/load_lines.py",
    "code": "from pathlib import Path\n\n\ndef load_lines(path: Path) -> list[str]:\n    text = path.read_text()\n    return [line.strip() for line in text.splitlines() if line.strip()]",
    "spans": [
      {
        "start": 0,
        "end": 4,
        "className": "syntax-keyword"
      },
      {
        "start": 5,
        "end": 12,
        "className": "syntax-variable"
      },
      {
        "start": 13,
        "end": 19,
        "className": "syntax-keyword"
      },
      {
        "start": 20,
        "end": 24,
        "className": "syntax-type"
      },
      {
        "start": 27,
        "end": 30,
        "className": "syntax-keyword"
      },
      {
        "start": 31,
        "end": 41,
        "className": "syntax-function"
      },
      {
        "start": 42,
        "end": 46,
        "className": "syntax-variable"
      },
      {
        "start": 48,
        "end": 52,
        "className": "syntax-type"
      },
      {
        "start": 54,
        "end": 56,
        "className": "syntax-operator"
      },
      {
        "start": 57,
        "end": 61,
        "className": "syntax-variable"
      },
      {
        "start": 62,
        "end": 65,
        "className": "syntax-type"
      },
      {
        "start": 72,
        "end": 76,
        "className": "syntax-variable"
      },
      {
        "start": 77,
        "end": 78,
        "className": "syntax-operator"
      },
      {
        "start": 79,
        "end": 83,
        "className": "syntax-variable"
      },
      {
        "start": 84,
        "end": 93,
        "className": "syntax-property"
      },
      {
        "start": 100,
        "end": 106,
        "className": "syntax-keyword"
      },
      {
        "start": 108,
        "end": 112,
        "className": "syntax-variable"
      },
      {
        "start": 113,
        "end": 118,
        "className": "syntax-property"
      },
      {
        "start": 121,
        "end": 124,
        "className": "syntax-keyword"
      },
      {
        "start": 125,
        "end": 129,
        "className": "syntax-variable"
      },
      {
        "start": 130,
        "end": 132,
        "className": "syntax-operator"
      },
      {
        "start": 133,
        "end": 137,
        "className": "syntax-variable"
      },
      {
        "start": 138,
        "end": 148,
        "className": "syntax-property"
      },
      {
        "start": 151,
        "end": 153,
        "className": "syntax-keyword"
      },
      {
        "start": 154,
        "end": 158,
        "className": "syntax-variable"
      },
      {
        "start": 159,
        "end": 164,
        "className": "syntax-property"
      }
    ]
  },
  {
    "language": "shell",
    "name": "shell/deploy.sh",
    "code": "set -eu\n\nrelease=\"$DEPLOY_ROOT/releases/$BUILD_ID\"\nmkdir -p \"$release\"\nrsync -a --delete \"$BUILD_DIR\"/ \"$release\"/",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-function"
      },
      {
        "start": 4,
        "end": 7,
        "className": "syntax-constant"
      },
      {
        "start": 9,
        "end": 16,
        "className": "syntax-property"
      },
      {
        "start": 17,
        "end": 50,
        "className": "syntax-string"
      },
      {
        "start": 51,
        "end": 56,
        "className": "syntax-function"
      },
      {
        "start": 57,
        "end": 59,
        "className": "syntax-constant"
      },
      {
        "start": 60,
        "end": 70,
        "className": "syntax-string"
      },
      {
        "start": 71,
        "end": 76,
        "className": "syntax-function"
      },
      {
        "start": 77,
        "end": 79,
        "className": "syntax-constant"
      },
      {
        "start": 80,
        "end": 88,
        "className": "syntax-constant"
      },
      {
        "start": 89,
        "end": 101,
        "className": "syntax-string"
      },
      {
        "start": 103,
        "end": 113,
        "className": "syntax-string"
      }
    ]
  },
  {
    "language": "shell",
    "name": "shell/filter.sh",
    "code": "set -eu\n\nfor path in \"$@\"; do\n  [ -f \"$path\" ] || continue\n  printf '%s\\n' \"$path\"\ndone",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-function"
      },
      {
        "start": 4,
        "end": 7,
        "className": "syntax-constant"
      },
      {
        "start": 9,
        "end": 12,
        "className": "syntax-keyword"
      },
      {
        "start": 13,
        "end": 17,
        "className": "syntax-property"
      },
      {
        "start": 18,
        "end": 20,
        "className": "syntax-keyword"
      },
      {
        "start": 21,
        "end": 25,
        "className": "syntax-string"
      },
      {
        "start": 27,
        "end": 29,
        "className": "syntax-keyword"
      },
      {
        "start": 37,
        "end": 44,
        "className": "syntax-string"
      },
      {
        "start": 50,
        "end": 58,
        "className": "syntax-function"
      },
      {
        "start": 61,
        "end": 67,
        "className": "syntax-function"
      },
      {
        "start": 68,
        "end": 74,
        "className": "syntax-string"
      },
      {
        "start": 75,
        "end": 82,
        "className": "syntax-string"
      },
      {
        "start": 83,
        "end": 87,
        "className": "syntax-keyword"
      }
    ]
  },
  {
    "language": "typescript",
    "name": "typescript/events.ts",
    "code": "function onKey(event: KeyboardEvent): string | null {\n  return event.key.length === 1 ? event.key : null;\n}",
    "spans": [
      {
        "start": 0,
        "end": 8,
        "className": "syntax-keyword"
      },
      {
        "start": 9,
        "end": 14,
        "className": "syntax-function"
      },
      {
        "start": 14,
        "end": 15,
        "className": "syntax-punctuation"
      },
      {
        "start": 15,
        "end": 20,
        "className": "syntax-variable"
      },
      {
        "start": 22,
        "end": 35,
        "className": "syntax-type"
      },
      {
        "start": 35,
        "end": 36,
        "className": "syntax-punctuation"
      },
      {
        "start": 38,
        "end": 44,
        "className": "syntax-type"
      },
      {
        "start": 45,
        "end": 46,
        "className": "syntax-operator"
      },
      {
        "start": 47,
        "end": 51,
        "className": "syntax-constant"
      },
      {
        "start": 52,
        "end": 53,
        "className": "syntax-punctuation"
      },
      {
        "start": 56,
        "end": 62,
        "className": "syntax-keyword"
      },
      {
        "start": 63,
        "end": 68,
        "className": "syntax-variable"
      },
      {
        "start": 68,
        "end": 69,
        "className": "syntax-punctuation"
      },
      {
        "start": 69,
        "end": 72,
        "className": "syntax-property"
      },
      {
        "start": 72,
        "end": 73,
        "className": "syntax-punctuation"
      },
      {
        "start": 73,
        "end": 79,
        "className": "syntax-property"
      },
      {
        "start": 80,
        "end": 83,
        "className": "syntax-operator"
      },
      {
        "start": 84,
        "end": 85,
        "className": "syntax-number"
      },
      {
        "start": 88,
        "end": 93,
        "className": "syntax-variable"
      },
      {
        "start": 93,
        "end": 94,
        "className": "syntax-punctuation"
      },
      {
        "start": 94,
        "end": 97,
        "className": "syntax-property"
      },
      {
        "start": 100,
        "end": 104,
        "className": "syntax-constant"
      },
      {
        "start": 104,
        "end": 105,
        "className": "syntax-punctuation"
      },
      {
        "start": 106,
        "end": 107,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "typescript",
    "name": "typescript/result.ts",
    "code": "type Result<T> = {\n  ok: boolean;\n  value: T | null;\n};\n\nconst ready: Result<number> = { ok: true, value: 1 };",
    "spans": [
      {
        "start": 0,
        "end": 4,
        "className": "syntax-keyword"
      },
      {
        "start": 5,
        "end": 11,
        "className": "syntax-type"
      },
      {
        "start": 11,
        "end": 12,
        "className": "syntax-operator"
      },
      {
        "start": 12,
        "end": 13,
        "className": "syntax-type"
      },
      {
        "start": 13,
        "end": 14,
        "className": "syntax-operator"
      },
      {
        "start": 15,
        "end": 16,
        "className": "syntax-operator"
      },
      {
        "start": 17,
        "end": 18,
        "className": "syntax-punctuation"
      },
      {
        "start": 21,
        "end": 23,
        "className": "syntax-property"
      },
      {
        "start": 25,
        "end": 32,
        "className": "syntax-type"
      },
      {
        "start": 32,
        "end": 33,
        "className": "syntax-punctuation"
      },
      {
        "start": 36,
        "end": 41,
        "className": "syntax-property"
      },
      {
        "start": 43,
        "end": 44,
        "className": "syntax-type"
      },
      {
        "start": 45,
        "end": 46,
        "className": "syntax-operator"
      },
      {
        "start": 47,
        "end": 51,
        "className": "syntax-constant"
      },
      {
        "start": 51,
        "end": 52,
        "className": "syntax-punctuation"
      },
      {
        "start": 53,
        "end": 55,
        "className": "syntax-punctuation"
      },
      {
        "start": 57,
        "end": 62,
        "className": "syntax-keyword"
      },
      {
        "start": 63,
        "end": 68,
        "className": "syntax-variable"
      },
      {
        "start": 70,
        "end": 76,
        "className": "syntax-type"
      },
      {
        "start": 76,
        "end": 77,
        "className": "syntax-operator"
      },
      {
        "start": 77,
        "end": 83,
        "className": "syntax-type"
      },
      {
        "start": 83,
        "end": 84,
        "className": "syntax-operator"
      },
      {
        "start": 85,
        "end": 86,
        "className": "syntax-operator"
      },
      {
        "start": 87,
        "end": 88,
        "className": "syntax-punctuation"
      },
      {
        "start": 89,
        "end": 91,
        "className": "syntax-property"
      },
      {
        "start": 93,
        "end": 97,
        "className": "syntax-constant"
      },
      {
        "start": 97,
        "end": 98,
        "className": "syntax-punctuation"
      },
      {
        "start": 99,
        "end": 104,
        "className": "syntax-property"
      },
      {
        "start": 106,
        "end": 107,
        "className": "syntax-number"
      },
      {
        "start": 108,
        "end": 110,
        "className": "syntax-punctuation"
      }
    ]
  }
];
