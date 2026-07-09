           typename _Compare, typename _Alloc>
    void
    _Rb_tree<_Key, _Val, _KeyOfValue, _Compare, _Alloc>::
    _M_erase(_Node_ptr __x)
    {
      // Erase without rebalancing.
      while (__x)
        {
          _M_erase(_S_right(__x));
          _Node_ptr __y = _S_left(__x);
          _M_drop_node(__x);
          __x = __y;
        }
    }

  template<typename _Key, typename _Val, typename _KeyOfValue,
           typename _Compare, typename _Alloc>
    typename _Rb_tree<_Key, _Val, _KeyOfValue,
                      _Compare, _Alloc>::_Base_ptr
    _Rb_tree<_Key, _Val, _KeyOfValue, _Compare, _Alloc>::
    _M_lower_bound(_Base_ptr __x, _Base_ptr __y,
                   const _Key& __k) const
    {
      while (__x)
        if (!_M_impl._M_key_compare(_S_key(__x), __k))
          __y = __x, __x = _S_left(__x);
        else
          __x = _S_right(__x);
      return __y;
    }

  template<typename _Key, typename _Val, typename _KeyOfValue,
           typename _Compare, typename _Alloc>
    typename _Rb_tree<_Key, _Val, _KeyOfValue,
                      _Compare, _Alloc>::_Base_ptr
    _Rb_tree<_Key, _Val, _KeyOfValue, _Compare, _Alloc>::
    _M_upper_bound(_Base_ptr __x, _Base_ptr __y,
                   const _Key& __k) const
    {
      while (__x)
        if (_M_impl._M_key_compare(__k, _S_key(__x)))
          __y = __x, __x = _S_left(__x);
        else
          __x = _S_right(__x);
      return __y;
    }

  template<typename _Key, typename _Val, typename _KeyOfValue,
           typename _Compare, typename _Alloc>
    pair<typename _Rb_tree<_Key, _Val, _KeyOfValue,
                           _Compare, _Alloc>::iterator,
         typename _Rb_tree<_Key, _Val, _KeyOfValue,
                           _Compare, _Alloc>::iterator>
    _Rb_tree<_Key, _Val, _KeyOfValue, _Compare, _Alloc>::
    equal_range(const _Key& __k)
    {
      typedef pair<iterator, iterator> _Ret;

      _Base_ptr __x = _M_begin();
      _Base_ptr __y = _M_end();
      while (__x)
        {
          if (_M_impl._M_key_compare(_S_key(__x), __k))
            __x = _S_right(__x);
          else if (_M_impl._M_key_compare(__k, _S_key(__x)))
            __y = __x, __x = _S_left(__x);
          else
            {
              _Base_ptr __xu(__x);
              _Base_ptr __yu(__y);
              __y = __x, __x = _S_left(__x);
              __xu = _S_right(__xu);
              return _Ret(iterator(_M_lower_bound(__x, __y, __k)),
                          iterator(_M_upper_bound(__xu, __yu, __k)));
            }
        }
      return _Ret(iterator(__y), iterator(__y));
    }

  template<typename _Key, typename _Val, typename _KeyOfValue,
           typename _Compare, typename _Alloc>
    pair<typename _Rb_tree<_Key, _Val, _KeyOfValue,
                           _Compare, _Alloc>::const_iterator,
         typename _Rb_tree<_Key, _Val, _KeyOfValue,
                           _Compare, _Alloc>::const_iterator>
    _Rb_tree<_Key, _Val, _KeyOfValue, _Compare, _Alloc>::
    equal_range(const _Key& __k) const
    {
      typedef pair<const_iterator, const_iterator> _Ret;

      _Base_ptr __x = _M_begin();
      _Base_ptr __y = _M_end();
      while (__x)
        {
          if (_M_impl._M_key_compare(_S_key(__x), __k))
            __x = _S_right(__x);
          else if (_M_impl._M_key_compare(__k, _S_key(__x)))
            __y = __x, __x = _S_left(__x);
          else
            {
              _Base_ptr __xu(__x);
              _Base_ptr __yu(__y);
              __y = __x, __x = _S_left(__x);
              __xu = _S_right(__xu);
              return _Ret(const_iterator(_M_lower_bound(__x, __y, __k)),
                          const_iterator(_M_upper_bound(__xu, __yu, __k)));
            }
        }
      return _Ret(const_iterator(__y), const_iterator(__y));
