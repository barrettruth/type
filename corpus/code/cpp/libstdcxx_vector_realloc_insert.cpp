      _M_realloc_insert(iterator __position, _Args&&... __args)
#else
  template<typename _Tp, typename _Alloc>
    void
    vector<_Tp, _Alloc>::
    _M_realloc_insert(iterator __position, const _Tp& __x)
#endif
    {
      const size_type __len = _M_check_len(1u, "vector::_M_realloc_insert");
      if (__len <= 0)
        __builtin_unreachable ();
      pointer __old_start = this->_M_impl._M_start;
      pointer __old_finish = this->_M_impl._M_finish;
      const size_type __elems_before = __position - begin();
      pointer __new_start(this->_M_allocate(__len));
      pointer __new_finish(__new_start);

      {
        _Guard_alloc __guard(__new_start, __len, *this);

        // The order of the three operations is dictated by the C++11
        // case, where the moves could alter a new element belonging
        // to the existing vector.  This is an issue only for callers
        // taking the element by lvalue ref (see last bullet of C++11
        // [res.on.arguments]).

        // If this throws, the existing elements are unchanged.
#if __cplusplus >= 201103L
        _Alloc_traits::construct(this->_M_impl,
                                 std::__to_address(__new_start + __elems_before),
                                 std::forward<_Args>(__args)...);
#else
        _Alloc_traits::construct(this->_M_impl,
                                 __new_start + __elems_before,
                                 __x);
#endif

#if __cplusplus >= 201103L
        if _GLIBCXX17_CONSTEXPR (_S_use_relocate())
          {
            // Relocation cannot throw.
            __new_finish = _S_relocate(__old_start, __position.base(),
                                       __new_start, _M_get_Tp_allocator());
            ++__new_finish;
            __new_finish = _S_relocate(__position.base(), __old_finish,
                                       __new_finish, _M_get_Tp_allocator());
          }
        else
#endif
          {
            // RAII type to destroy initialized elements.
            struct _Guard_elts
            {
              pointer _M_first, _M_last;  // Elements to destroy
              _Tp_alloc_type& _M_alloc;

              _GLIBCXX20_CONSTEXPR
              _Guard_elts(pointer __elt, _Tp_alloc_type& __a)
              : _M_first(__elt), _M_last(__elt + 1), _M_alloc(__a)
              { }

              _GLIBCXX20_CONSTEXPR
              ~_Guard_elts()
              { std::_Destroy(_M_first, _M_last, _M_alloc); }

            private:
              _Guard_elts(const _Guard_elts&);
            };

            // Guard the new element so it will be destroyed if anything throws.
            _Guard_elts __guard_elts(__new_start + __elems_before, _M_impl);

            __new_finish = std::__uninitialized_move_if_noexcept_a(
                             __old_start, __position.base(),
                             __new_start, _M_get_Tp_allocator());

            ++__new_finish;
            // Guard everything before the new element too.
            __guard_elts._M_first = __new_start;

            __new_finish = std::__uninitialized_move_if_noexcept_a(
                              __position.base(), __old_finish,
                              __new_finish, _M_get_Tp_allocator());

            // New storage has been fully initialized, destroy the old elements.
            __guard_elts._M_first = __old_start;
            __guard_elts._M_last = __old_finish;
          }
