use leptos::*;

#[derive(Clone, Copy, PartialEq, Eq)]
enum LayoutId {
    Qwerty,
    Dvorak,
    ColemakDh,
    Baremak,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum LessonId {
    Home,
    Symbols,
    Words,
}

struct KeyDef {
    normal: &'static str,
    alt: Option<&'static str>,
}

struct LayoutDef {
    id: LayoutId,
    name: &'static str,
    subtitle: &'static str,
    rows: &'static [&'static [KeyDef]],
}

struct LessonDef {
    id: LessonId,
    name: &'static str,
    text: &'static str,
}

const QWERTY_ROWS: &[&[KeyDef]] = &[
    &[
        KeyDef {
            normal: "q",
            alt: None,
        },
        KeyDef {
            normal: "w",
            alt: None,
        },
        KeyDef {
            normal: "e",
            alt: None,
        },
        KeyDef {
            normal: "r",
            alt: None,
        },
        KeyDef {
            normal: "t",
            alt: None,
        },
        KeyDef {
            normal: "y",
            alt: None,
        },
        KeyDef {
            normal: "u",
            alt: None,
        },
        KeyDef {
            normal: "i",
            alt: None,
        },
        KeyDef {
            normal: "o",
            alt: None,
        },
        KeyDef {
            normal: "p",
            alt: None,
        },
    ],
    &[
        KeyDef {
            normal: "a",
            alt: None,
        },
        KeyDef {
            normal: "s",
            alt: None,
        },
        KeyDef {
            normal: "d",
            alt: None,
        },
        KeyDef {
            normal: "f",
            alt: None,
        },
        KeyDef {
            normal: "g",
            alt: None,
        },
        KeyDef {
            normal: "h",
            alt: None,
        },
        KeyDef {
            normal: "j",
            alt: None,
        },
        KeyDef {
            normal: "k",
            alt: None,
        },
        KeyDef {
            normal: "l",
            alt: None,
        },
        KeyDef {
            normal: ";",
            alt: None,
        },
        KeyDef {
            normal: "'",
            alt: None,
        },
    ],
    &[
        KeyDef {
            normal: "z",
            alt: None,
        },
        KeyDef {
            normal: "x",
            alt: None,
        },
        KeyDef {
            normal: "c",
            alt: None,
        },
        KeyDef {
            normal: "v",
            alt: None,
        },
        KeyDef {
            normal: "b",
            alt: None,
        },
        KeyDef {
            normal: "n",
            alt: None,
        },
        KeyDef {
            normal: "m",
            alt: None,
        },
        KeyDef {
            normal: ",",
            alt: None,
        },
        KeyDef {
            normal: ".",
            alt: None,
        },
        KeyDef {
            normal: "/",
            alt: None,
        },
    ],
];

const DVORAK_ROWS: &[&[KeyDef]] = &[
    &[
        KeyDef {
            normal: "'",
            alt: None,
        },
        KeyDef {
            normal: ",",
            alt: None,
        },
        KeyDef {
            normal: ".",
            alt: None,
        },
        KeyDef {
            normal: "p",
            alt: None,
        },
        KeyDef {
            normal: "y",
            alt: None,
        },
        KeyDef {
            normal: "f",
            alt: None,
        },
        KeyDef {
            normal: "g",
            alt: None,
        },
        KeyDef {
            normal: "c",
            alt: None,
        },
        KeyDef {
            normal: "r",
            alt: None,
        },
        KeyDef {
            normal: "l",
            alt: None,
        },
        KeyDef {
            normal: "/",
            alt: None,
        },
        KeyDef {
            normal: "=",
            alt: None,
        },
    ],
    &[
        KeyDef {
            normal: "a",
            alt: None,
        },
        KeyDef {
            normal: "o",
            alt: None,
        },
        KeyDef {
            normal: "e",
            alt: None,
        },
        KeyDef {
            normal: "u",
            alt: None,
        },
        KeyDef {
            normal: "i",
            alt: None,
        },
        KeyDef {
            normal: "d",
            alt: None,
        },
        KeyDef {
            normal: "h",
            alt: None,
        },
        KeyDef {
            normal: "t",
            alt: None,
        },
        KeyDef {
            normal: "n",
            alt: None,
        },
        KeyDef {
            normal: "s",
            alt: None,
        },
        KeyDef {
            normal: "-",
            alt: None,
        },
    ],
    &[
        KeyDef {
            normal: ";",
            alt: None,
        },
        KeyDef {
            normal: "q",
            alt: None,
        },
        KeyDef {
            normal: "j",
            alt: None,
        },
        KeyDef {
            normal: "k",
            alt: None,
        },
        KeyDef {
            normal: "x",
            alt: None,
        },
        KeyDef {
            normal: "b",
            alt: None,
        },
        KeyDef {
            normal: "m",
            alt: None,
        },
        KeyDef {
            normal: "w",
            alt: None,
        },
        KeyDef {
            normal: "v",
            alt: None,
        },
        KeyDef {
            normal: "z",
            alt: None,
        },
    ],
];

const COLEMAK_DH_ROWS: &[&[KeyDef]] = &[
    &[
        KeyDef {
            normal: "q",
            alt: None,
        },
        KeyDef {
            normal: "w",
            alt: None,
        },
        KeyDef {
            normal: "f",
            alt: None,
        },
        KeyDef {
            normal: "p",
            alt: None,
        },
        KeyDef {
            normal: "b",
            alt: None,
        },
        KeyDef {
            normal: "j",
            alt: None,
        },
        KeyDef {
            normal: "l",
            alt: None,
        },
        KeyDef {
            normal: "u",
            alt: None,
        },
        KeyDef {
            normal: "y",
            alt: None,
        },
        KeyDef {
            normal: ";",
            alt: None,
        },
    ],
    &[
        KeyDef {
            normal: "a",
            alt: None,
        },
        KeyDef {
            normal: "r",
            alt: None,
        },
        KeyDef {
            normal: "s",
            alt: None,
        },
        KeyDef {
            normal: "t",
            alt: None,
        },
        KeyDef {
            normal: "g",
            alt: None,
        },
        KeyDef {
            normal: "m",
            alt: None,
        },
        KeyDef {
            normal: "n",
            alt: None,
        },
        KeyDef {
            normal: "e",
            alt: None,
        },
        KeyDef {
            normal: "i",
            alt: None,
        },
        KeyDef {
            normal: "o",
            alt: None,
        },
        KeyDef {
            normal: "'",
            alt: None,
        },
    ],
    &[
        KeyDef {
            normal: "z",
            alt: None,
        },
        KeyDef {
            normal: "x",
            alt: None,
        },
        KeyDef {
            normal: "c",
            alt: None,
        },
        KeyDef {
            normal: "d",
            alt: None,
        },
        KeyDef {
            normal: "v",
            alt: None,
        },
        KeyDef {
            normal: "k",
            alt: None,
        },
        KeyDef {
            normal: "h",
            alt: None,
        },
        KeyDef {
            normal: ",",
            alt: None,
        },
        KeyDef {
            normal: ".",
            alt: None,
        },
        KeyDef {
            normal: "/",
            alt: None,
        },
    ],
];

const BAREMAK_ROWS: &[&[KeyDef]] = &[
    &[
        KeyDef {
            normal: "q",
            alt: Some("!"),
        },
        KeyDef {
            normal: "w",
            alt: Some("@"),
        },
        KeyDef {
            normal: "f",
            alt: Some("#"),
        },
        KeyDef {
            normal: "p",
            alt: Some("<"),
        },
        KeyDef {
            normal: "b",
            alt: Some("/"),
        },
        KeyDef {
            normal: "j",
            alt: Some("\\"),
        },
        KeyDef {
            normal: "l",
            alt: Some(">"),
        },
        KeyDef {
            normal: "u",
            alt: Some("&"),
        },
        KeyDef {
            normal: "y",
            alt: Some("$"),
        },
        KeyDef {
            normal: ";",
            alt: Some("|"),
        },
    ],
    &[
        KeyDef {
            normal: "a",
            alt: Some("["),
        },
        KeyDef {
            normal: "r",
            alt: Some("{"),
        },
        KeyDef {
            normal: "s",
            alt: Some("="),
        },
        KeyDef {
            normal: "t",
            alt: Some("("),
        },
        KeyDef {
            normal: "g",
            alt: Some("+"),
        },
        KeyDef {
            normal: "m",
            alt: Some("-"),
        },
        KeyDef {
            normal: "n",
            alt: Some(")"),
        },
        KeyDef {
            normal: "e",
            alt: Some("~"),
        },
        KeyDef {
            normal: "i",
            alt: Some("}"),
        },
        KeyDef {
            normal: "o",
            alt: Some("]"),
        },
        KeyDef {
            normal: "'",
            alt: Some("`"),
        },
    ],
    &[
        KeyDef {
            normal: "z",
            alt: Some("%"),
        },
        KeyDef {
            normal: "x",
            alt: Some("^"),
        },
        KeyDef {
            normal: "c",
            alt: Some("*"),
        },
        KeyDef {
            normal: "d",
            alt: Some("_"),
        },
        KeyDef {
            normal: "v",
            alt: Some("?"),
        },
        KeyDef {
            normal: "k",
            alt: Some(":"),
        },
        KeyDef {
            normal: "h",
            alt: Some(";"),
        },
        KeyDef {
            normal: ",",
            alt: Some("'"),
        },
        KeyDef {
            normal: ".",
            alt: Some("\""),
        },
        KeyDef {
            normal: "/",
            alt: None,
        },
    ],
];

const LAYOUTS: &[LayoutDef] = &[
    LayoutDef {
        id: LayoutId::Qwerty,
        name: "QWERTY",
        subtitle: "baseline physical layout",
        rows: QWERTY_ROWS,
    },
    LayoutDef {
        id: LayoutId::Dvorak,
        name: "Dvorak",
        subtitle: "alternate prose layout",
        rows: DVORAK_ROWS,
    },
    LayoutDef {
        id: LayoutId::ColemakDh,
        name: "Colemak-DH",
        subtitle: "standard Colemak-DH letters",
        rows: COLEMAK_DH_ROWS,
    },
    LayoutDef {
        id: LayoutId::Baremak,
        name: "Baremak",
        subtitle: "Colemak-DH plus Right Alt symbols",
        rows: BAREMAK_ROWS,
    },
];

const LESSONS: &[LessonDef] = &[
    LessonDef {
        id: LessonId::Home,
        name: "home row",
        text: "arst neio arst neio truth stone train notes",
    },
    LessonDef {
        id: LessonId::Symbols,
        name: "symbols",
        text: "[{=(+ -)~}] </ \\> != == += -= -> :: _ * |",
    },
    LessonDef {
        id: LessonId::Words,
        name: "words",
        text: "accuracy before speed calm hands clear thoughts steady practice",
    },
];

fn layout_by_id(id: LayoutId) -> &'static LayoutDef {
    LAYOUTS.iter().find(|layout| layout.id == id).unwrap()
}

fn lesson_by_id(id: LessonId) -> &'static LessonDef {
    LESSONS.iter().find(|lesson| lesson.id == id).unwrap()
}

fn key_label(key: &KeyDef, alt: bool) -> &'static str {
    if alt {
        key.alt.unwrap_or(key.normal)
    } else {
        key.normal
    }
}

fn expected_key(layout: &LayoutDef, expected: char) -> Option<(&'static str, bool)> {
    layout
        .rows
        .iter()
        .flat_map(|row| row.iter())
        .find_map(|key| {
            if key.normal.starts_with(expected) {
                Some((key.normal, false))
            } else if key.alt.is_some_and(|alt| alt.starts_with(expected)) {
                Some((key.normal, true))
            } else {
                None
            }
        })
}

fn printable_key(key: &str) -> Option<char> {
    if key == " " || key == "Spacebar" {
        Some(' ')
    } else if key.chars().count() == 1 {
        key.chars().next()
    } else {
        None
    }
}

fn visible_char(ch: char) -> String {
    if ch == ' ' {
        "·".to_string()
    } else {
        ch.to_string()
    }
}

#[component]
fn App() -> impl IntoView {
    let (layout_id, set_layout_id) = create_signal(LayoutId::Baremak);
    let (lesson_id, set_lesson_id) = create_signal(LessonId::Symbols);
    let (cursor, set_cursor) = create_signal(0usize);
    let (mistakes, set_mistakes) = create_signal(0usize);
    let (last_wrong, set_last_wrong) = create_signal(None::<char>);
    let (alt_preview, set_alt_preview) = create_signal(false);

    create_effect(move |_| {
        layout_id.get();
        lesson_id.get();
        set_cursor.set(0);
        set_mistakes.set(0);
        set_last_wrong.set(None);
    });

    let on_keydown = move |event: web_sys::KeyboardEvent| {
        if event.code() == "AltRight" || event.key() == "AltGraph" {
            set_alt_preview.set(true);
            return;
        }

        let lesson = lesson_by_id(lesson_id.get());
        let chars: Vec<char> = lesson.text.chars().collect();
        let index = cursor.get();

        if event.key() == "Backspace" {
            event.prevent_default();
            set_cursor.set(index.saturating_sub(1));
            set_last_wrong.set(None);
            return;
        }

        let Some(typed) = printable_key(&event.key()) else {
            return;
        };

        event.prevent_default();

        let Some(expected) = chars.get(index).copied() else {
            return;
        };

        if typed == expected {
            set_cursor.set(index + 1);
            set_last_wrong.set(None);
        } else {
            set_mistakes.update(|count| *count += 1);
            set_last_wrong.set(Some(typed));
        }
    };

    let on_keyup = move |event: web_sys::KeyboardEvent| {
        if event.code() == "AltRight" || event.key() == "AltGraph" {
            set_alt_preview.set(false);
        }
    };

    view! {
        <main class="shell" tabindex="0" on:keydown=on_keydown on:keyup=on_keyup>
            <section class="hero">
                <p class="eyebrow">"type.barrettruth.com"</p>
                <h1>"accuracy first"</h1>
                <p class="summary">"A strict trainer for QWERTY, Dvorak, Colemak-DH, and Baremak. Wrong keys do not advance."</p>
            </section>

            <section class="panel controls">
                <div>
                    <p class="label">"layout"</p>
                    <div class="button-row">
                        {LAYOUTS.iter().map(|layout| {
                            let id = layout.id;
                            view! {
                                <button class:selected=move || layout_id.get() == id on:click=move |_| set_layout_id.set(id)>
                                    {layout.name}
                                </button>
                            }
                        }).collect_view()}
                    </div>
                </div>
                <div>
                    <p class="label">"course"</p>
                    <div class="button-row">
                        {LESSONS.iter().map(|lesson| {
                            let id = lesson.id;
                            view! {
                                <button class:selected=move || lesson_id.get() == id on:click=move |_| set_lesson_id.set(id)>
                                    {lesson.name}
                                </button>
                            }
                        }).collect_view()}
                    </div>
                </div>
            </section>

            <TypingPane layout_id=layout_id lesson_id=lesson_id cursor=cursor mistakes=mistakes last_wrong=last_wrong />
            <KeyboardPane layout_id=layout_id cursor=cursor lesson_id=lesson_id alt_preview=alt_preview />
        </main>
    }
}

#[component]
fn TypingPane(
    layout_id: ReadSignal<LayoutId>,
    lesson_id: ReadSignal<LessonId>,
    cursor: ReadSignal<usize>,
    mistakes: ReadSignal<usize>,
    last_wrong: ReadSignal<Option<char>>,
) -> impl IntoView {
    view! {
        <section class=move || if last_wrong.get().is_some() { "panel trainer blocked" } else { "panel trainer" }>
            <div class="trainer-head">
                <div>
                    <p class="label">"strict repeater"</p>
                    <p class="hint">{move || layout_by_id(layout_id.get()).subtitle}</p>
                </div>
                <div class="stats">
                    <span>{move || format!("{} chars", cursor.get())}</span>
                    <span>{move || format!("{} wrong", mistakes.get())}</span>
                </div>
            </div>
            <div class="text-line">
                {move || {
                    let lesson = lesson_by_id(lesson_id.get());
                    lesson.text.chars().enumerate().map(|(index, ch)| {
                        let class = if index < cursor.get() {
                            "typed"
                        } else if index == cursor.get() {
                            "current"
                        } else {
                            "future"
                        };
                        view! { <span class=class>{visible_char(ch)}</span> }
                    }).collect_view()
                }}
            </div>
            <p class="feedback">{move || {
                let lesson = lesson_by_id(lesson_id.get());
                let chars: Vec<char> = lesson.text.chars().collect();
                if cursor.get() >= chars.len() {
                    "complete — choose a course to repeat".to_string()
                } else if let Some(wrong) = last_wrong.get() {
                    format!("blocked on {}; expected {}", visible_char(wrong), visible_char(chars[cursor.get()]))
                } else {
                    format!("next: {}", visible_char(chars[cursor.get()]))
                }
            }}</p>
        </section>
    }
}

#[component]
fn KeyboardPane(
    layout_id: ReadSignal<LayoutId>,
    cursor: ReadSignal<usize>,
    lesson_id: ReadSignal<LessonId>,
    alt_preview: ReadSignal<bool>,
) -> impl IntoView {
    view! {
        <section class="panel keyboard-panel">
            <div class="trainer-head">
                <div>
                    <p class="label">"visual map"</p>
                    <p class="hint">{move || if layout_id.get() == LayoutId::Baremak { "hold Right Alt to preview symbols" } else { "base layer" }}</p>
                </div>
                <div class=move || if alt_preview.get() { "layer-chip active" } else { "layer-chip" }>
                    "Right Alt"
                </div>
            </div>
            <div class="keyboard">
                {move || {
                    let layout = layout_by_id(layout_id.get());
                    let lesson = lesson_by_id(lesson_id.get());
                    let chars: Vec<char> = lesson.text.chars().collect();
                    let expected = chars.get(cursor.get()).copied();
                    let expected_info = expected.and_then(|ch| expected_key(layout, ch));
                    layout.rows.iter().enumerate().map(|(row_index, row)| {
                        let row_class = format!("key-row row-{}", row_index);
                        view! {
                            <div class=row_class>
                                {row.iter().map(|key| {
                                    let use_alt = alt_preview.get() && key.alt.is_some();
                                    let label = key_label(key, use_alt);
                                    let normal = key.normal;
                                    let is_expected = expected_info.map(|(base, _)| base == normal).unwrap_or(false);
                                    let needs_alt = expected_info.map(|(base, alt)| base == normal && alt).unwrap_or(false);
                                    view! {
                                        <div class=move || {
                                            let mut class = String::from("key");
                                            if is_expected {
                                                class.push_str(" expected");
                                            }
                                            if needs_alt {
                                                class.push_str(" needs-alt");
                                            }
                                            class
                                        }>
                                            <span>{label}</span>
                                            {key.alt.map(|alt| view! { <small>{alt}</small> })}
                                        </div>
                                    }
                                }).collect_view()}
                            </div>
                        }
                    }).collect_view()
                }}
            </div>
        </section>
    }
}

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(|| view! { <App /> });
}
