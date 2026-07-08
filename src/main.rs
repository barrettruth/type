mod keyboard;

use keyboard::{layout_by_id, KeyboardPane, LayoutId, LAYOUTS};
use leptos::*;

#[derive(Clone, Copy, PartialEq, Eq)]
enum LessonId {
    Home,
    Symbols,
    Words,
}

struct LessonDef {
    id: LessonId,
    name: &'static str,
    text: &'static str,
}

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

fn lesson_by_id(id: LessonId) -> &'static LessonDef {
    LESSONS.iter().find(|lesson| lesson.id == id).unwrap()
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

    let expected = create_memo(move |_| {
        let lesson = lesson_by_id(lesson_id.get());
        lesson.text.chars().nth(cursor.get())
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
            <KeyboardPane layout_id=layout_id expected=expected alt_preview=alt_preview />
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

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(|| view! { <App /> });
}
