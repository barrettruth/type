def _finddoc(obj):
    if isclass(obj):
        for base in obj.__mro__:
            if base is not object:
                try:
                    doc = base.__doc__
                except AttributeError:
                    continue
                if doc is not None:
                    return doc
        return None

    if ismethod(obj):
        name = obj.__func__.__name__
        self = obj.__self__
        if (isclass(self) and
            getattr(getattr(self, name, None), '__func__') is obj.__func__):
            # classmethod
            cls = self
        else:
            cls = self.__class__
    elif isfunction(obj):
        name = obj.__name__
        cls = _findclass(obj)
        if cls is None or getattr(cls, name) is not obj:
            return None
    elif isbuiltin(obj):
        name = obj.__name__
        self = obj.__self__
        if (isclass(self) and
            self.__qualname__ + '.' + name == obj.__qualname__):
            # classmethod
            cls = self
        else:
            cls = self.__class__
    # Should be tested before isdatadescriptor().
    elif isinstance(obj, property):
        name = obj.__name__
        cls = _findclass(obj.fget)
        if cls is None or getattr(cls, name) is not obj:
            return None
    elif ismethoddescriptor(obj) or isdatadescriptor(obj):
        name = obj.__name__
        cls = obj.__objclass__
        if getattr(cls, name) is not obj:
            return None
        if ismemberdescriptor(obj):
            slots = getattr(cls, '__slots__', None)
            if isinstance(slots, dict) and name in slots:
                return slots[name]
    else:
        return None
    for base in cls.__mro__:
        try:
            doc = getattr(base, name).__doc__
        except AttributeError:
            continue
        if doc is not None:
            return doc
    return None
