    _GLIBCXX20_CONSTEXPR
    typename vector<_Tp, _Alloc>::iterator
    vector<_Tp, _Alloc>::
    _M_erase(iterator __position)
    {
      if (__position + 1 != end())
        _GLIBCXX_MOVE3(__position + 1, end(), __position);
      --this->_M_impl._M_finish;
      _Alloc_traits::destroy(this->_M_impl, this->_M_impl._M_finish);
      _GLIBCXX_ASAN_ANNOTATE_SHRINK(1);
      return __position;
    }

  template<typename _Tp, typename _Alloc>
    _GLIBCXX20_CONSTEXPR
    typename vector<_Tp, _Alloc>::iterator
    vector<_Tp, _Alloc>::
    _M_erase(iterator __first, iterator __last)
    {
      if (__first != __last)
        {
          if (__last != end())
            _GLIBCXX_MOVE3(__last, end(), __first);
          _M_erase_at_end(__first.base() + (end() - __last));
        }
      return __first;
    }

  template<typename _Tp, typename _Alloc>
    _GLIBCXX20_CONSTEXPR
    vector<_Tp, _Alloc>&
    vector<_Tp, _Alloc>::
    operator=(const vector<_Tp, _Alloc>& __x)
    {
      if (std::__addressof(__x) != this)
        {
          _GLIBCXX_ASAN_ANNOTATE_REINIT;
#if __cplusplus >= 201103L
          if (_Alloc_traits::_S_propagate_on_copy_assign())
            {
              if (!_Alloc_traits::_S_always_equal()
                  && _M_get_Tp_allocator() != __x._M_get_Tp_allocator())
                {
                  // replacement allocator cannot free existing storage
                  this->clear();
                  _M_deallocate(this->_M_impl._M_start,
                                this->_M_impl._M_end_of_storage
                                - this->_M_impl._M_start);
                  this->_M_impl._M_start = nullptr;
                  this->_M_impl._M_finish = nullptr;
                  this->_M_impl._M_end_of_storage = nullptr;
                }
              std::__alloc_on_copy(_M_get_Tp_allocator(),
                                   __x._M_get_Tp_allocator());
            }
#endif
          const size_type __xlen = __x.size();
          if (__xlen > capacity())
            {
              pointer __tmp = _M_allocate_and_copy(__xlen, __x.begin(),
                                                   __x.end());
              std::_Destroy(this->_M_impl._M_start, this->_M_impl._M_finish,
                            _M_get_Tp_allocator());
              _M_deallocate(this->_M_impl._M_start,
                            this->_M_impl._M_end_of_storage
                            - this->_M_impl._M_start);
              this->_M_impl._M_start = __tmp;
              this->_M_impl._M_end_of_storage = this->_M_impl._M_start + __xlen;
            }
          else if (size() >= __xlen)
            {
              std::_Destroy(std::copy(__x.begin(), __x.end(), begin()),
                            end(), _M_get_Tp_allocator());
            }
          else
            {
              std::copy(__x._M_impl._M_start, __x._M_impl._M_start + size(),
                        this->_M_impl._M_start);
              std::__uninitialized_copy_a(__x._M_impl._M_start + size(),
                                          __x._M_impl._M_finish,
                                          this->_M_impl._M_finish,
                                          _M_get_Tp_allocator());
            }
          this->_M_impl._M_finish = this->_M_impl._M_start + __xlen;
        }
      return *this;
    }
