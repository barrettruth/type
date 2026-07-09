  template<typename _Tp, typename _Alloc>
    _GLIBCXX20_CONSTEXPR
    void
    vector<_Tp, _Alloc>::
    _M_fill_assign(size_t __n, const value_type& __val)
    {
      const size_type __sz = size();
      if (__n > capacity())
        {
          if (__n <= __sz)
            __builtin_unreachable();
          vector __tmp(__n, __val, _M_get_Tp_allocator());
          __tmp._M_impl._M_swap_data(this->_M_impl);
        }
      else if (__n > __sz)
        {
          std::fill(begin(), end(), __val);
          const size_type __add = __n - __sz;
          _GLIBCXX_ASAN_ANNOTATE_GROW(__add);
          this->_M_impl._M_finish =
            std::__uninitialized_fill_n_a(this->_M_impl._M_finish,
                                          __add, __val, _M_get_Tp_allocator());
          _GLIBCXX_ASAN_ANNOTATE_GREW(__add);
        }
      else
        _M_erase_at_end(std::fill_n(this->_M_impl._M_start, __n, __val));
    }

  template<typename _Tp, typename _Alloc>
    template<typename _InputIterator>
      _GLIBCXX20_CONSTEXPR
      void
      vector<_Tp, _Alloc>::
      _M_assign_aux(_InputIterator __first, _InputIterator __last,
                    std::input_iterator_tag)
      {
        pointer __cur(this->_M_impl._M_start);
        for (; __first != __last && __cur != this->_M_impl._M_finish;
             ++__cur, (void)++__first)
          *__cur = *__first;
        if (__first == __last)
          _M_erase_at_end(__cur);
        else
          _M_range_insert(end(), __first, __last,
                          std::__iterator_category(__first));
      }

  template<typename _Tp, typename _Alloc>
    template<typename _ForwardIterator>
      _GLIBCXX20_CONSTEXPR
      void
      vector<_Tp, _Alloc>::
      _M_assign_aux(_ForwardIterator __first, _ForwardIterator __last,
                    std::forward_iterator_tag)
      {
        const size_type __sz = size();
        const size_type __len = std::distance(__first, __last);

        if (__len > capacity())
          {
            if (__len <= __sz)
              __builtin_unreachable();

            _S_check_init_len(__len, _M_get_Tp_allocator());
            pointer __tmp(_M_allocate_and_copy(__len, __first, __last));
            std::_Destroy(this->_M_impl._M_start, this->_M_impl._M_finish,
                          _M_get_Tp_allocator());
            _GLIBCXX_ASAN_ANNOTATE_REINIT;
            _M_deallocate(this->_M_impl._M_start,
                          this->_M_impl._M_end_of_storage
                          - this->_M_impl._M_start);
            this->_M_impl._M_start = __tmp;
            this->_M_impl._M_finish = this->_M_impl._M_start + __len;
            this->_M_impl._M_end_of_storage = this->_M_impl._M_finish;
          }
        else if (__sz >= __len)
          _M_erase_at_end(std::copy(__first, __last, this->_M_impl._M_start));
        else
