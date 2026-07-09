    _M_fill_insert(iterator __position, size_type __n, const value_type& __x)
    {
      if (__n != 0)
        {
          if (size_type(this->_M_impl._M_end_of_storage
                        - this->_M_impl._M_finish) >= __n)
            {
#if __cplusplus < 201103L
              value_type __x_copy = __x;
#else
              _Temporary_value __tmp(this, __x);
              value_type& __x_copy = __tmp._M_val();
#endif
              const size_type __elems_after = end() - __position;
              pointer __old_finish(this->_M_impl._M_finish);
              if (__elems_after > __n)
                {
                  _GLIBCXX_ASAN_ANNOTATE_GROW(__n);
                  std::__uninitialized_move_a(__old_finish - __n,
                                              __old_finish,
                                              __old_finish,
                                              _M_get_Tp_allocator());
                  this->_M_impl._M_finish += __n;
                  _GLIBCXX_ASAN_ANNOTATE_GREW(__n);
                  _GLIBCXX_MOVE_BACKWARD3(__position.base(),
                                          __old_finish - __n, __old_finish);
                  std::fill(__position.base(), __position.base() + __n,
                            __x_copy);
                }
              else
                {
                  _GLIBCXX_ASAN_ANNOTATE_GROW(__n);
                  this->_M_impl._M_finish =
                    std::__uninitialized_fill_n_a(__old_finish,
                                                  __n - __elems_after,
                                                  __x_copy,
                                                  _M_get_Tp_allocator());
                  _GLIBCXX_ASAN_ANNOTATE_GREW(__n - __elems_after);
                  std::__uninitialized_move_a(__position.base(), __old_finish,
                                              this->_M_impl._M_finish,
                                              _M_get_Tp_allocator());
                  this->_M_impl._M_finish += __elems_after;
                  _GLIBCXX_ASAN_ANNOTATE_GREW(__elems_after);
                  std::fill(__position.base(), __old_finish, __x_copy);
                }
            }
          else
            {
              // Make local copies of these members because the compiler thinks
              // the allocator can alter them if 'this' is globally reachable.
              pointer __old_start = this->_M_impl._M_start;
              pointer __old_finish = this->_M_impl._M_finish;
              const pointer __pos = __position.base();

              const size_type __len =
                _M_check_len(__n, "vector::_M_fill_insert");
              const size_type __elems_before = __pos - __old_start;
              pointer __new_start(this->_M_allocate(__len));
              pointer __new_finish(__new_start);
              __try
                {
                  // See _M_realloc_insert above.
                  std::__uninitialized_fill_n_a(__new_start + __elems_before,
                                                __n, __x,
                                                _M_get_Tp_allocator());
                  __new_finish = pointer();

                  __new_finish
                    = std::__uninitialized_move_if_noexcept_a
                    (__old_start, __pos, __new_start, _M_get_Tp_allocator());

                  __new_finish += __n;

                  __new_finish
                    = std::__uninitialized_move_if_noexcept_a
                    (__pos, __old_finish, __new_finish, _M_get_Tp_allocator());
                }
