#[derive(Clone, Copy, PartialEq, Eq)]
pub enum LayoutId {
    Qwerty,
    Dvorak,
    ColemakDh,
    Baremak,
}

pub struct LayoutDef {
    pub id: LayoutId,
    pub name: &'static str,
}

pub const LAYOUTS: &[LayoutDef] = &[
    LayoutDef {
        id: LayoutId::Qwerty,
        name: "QWERTY",
    },
    LayoutDef {
        id: LayoutId::Dvorak,
        name: "Dvorak",
    },
    LayoutDef {
        id: LayoutId::ColemakDh,
        name: "Colemak-DH",
    },
    LayoutDef {
        id: LayoutId::Baremak,
        name: "Baremak",
    },
];
