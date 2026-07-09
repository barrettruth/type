    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    find(const key_type& __k)
    -> iterator
    { return iterator(_M_locate(__k)); }

  template<typename _Key, typename _Value, typename _Alloc,
           typename _ExtractKey, typename _Equal,
           typename _Hash, typename _RangeHash, typename _Unused,
           typename _RehashPolicy, typename _Traits>
    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    find(const key_type& __k) const
    -> const_iterator
    { return const_iterator(_M_locate(__k)); }

#if __cplusplus > 201703L
  template<typename _Key, typename _Value, typename _Alloc,
           typename _ExtractKey, typename _Equal,
           typename _Hash, typename _RangeHash, typename _Unused,
           typename _RehashPolicy, typename _Traits>
    template<typename _Kt, typename, typename>
      auto
      _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
                 _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
      _M_find_tr(const _Kt& __k)
      -> iterator
      {
        if (size() <= __small_size_threshold())
          {
            for (auto __n = _M_begin(); __n; __n = __n->_M_next())
              if (this->_M_key_equals_tr(__k, *__n))
                return iterator(__n);
            return end();
          }

        __hash_code __code = this->_M_hash_code_tr(__k);
        std::size_t __bkt = _M_bucket_index(__code);
        return iterator(_M_find_node_tr(__bkt, __k, __code));
      }

  template<typename _Key, typename _Value, typename _Alloc,
           typename _ExtractKey, typename _Equal,
           typename _Hash, typename _RangeHash, typename _Unused,
           typename _RehashPolicy, typename _Traits>
    template<typename _Kt, typename, typename>
      auto
      _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
                 _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
      _M_find_tr(const _Kt& __k) const
      -> const_iterator
      {
        if (size() <= __small_size_threshold())
          {
            for (auto __n = _M_begin(); __n; __n = __n->_M_next())
              if (this->_M_key_equals_tr(__k, *__n))
                return const_iterator(__n);
            return end();
          }

        __hash_code __code = this->_M_hash_code_tr(__k);
        std::size_t __bkt = _M_bucket_index(__code);
        return const_iterator(_M_find_node_tr(__bkt, __k, __code));
      }
#endif

  template<typename _Key, typename _Value, typename _Alloc,
           typename _ExtractKey, typename _Equal,
           typename _Hash, typename _RangeHash, typename _Unused,
           typename _RehashPolicy, typename _Traits>
    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    count(const key_type& __k) const
    -> size_type
    {
      auto __it = find(__k);
      if (!__it._M_cur)
        return 0;

      if (__unique_keys::value)
        return 1;
