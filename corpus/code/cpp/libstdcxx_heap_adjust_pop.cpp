  template<typename _RandomAccessIterator, typename _Distance,
           typename _Tp, typename _Compare>
    _GLIBCXX20_CONSTEXPR
    void
    __adjust_heap(_RandomAccessIterator __first, _Distance __holeIndex,
                  _Distance __len, _Tp __value, _Compare __comp)
    {
      const _Distance __topIndex = __holeIndex;
      _Distance __secondChild = __holeIndex;
      while (__secondChild < (__len - 1) / 2)
        {
          __secondChild = 2 * (__secondChild + 1);
          if (__comp(__first + __secondChild,
                     __first + (__secondChild - 1)))
            __secondChild--;
          *(__first + __holeIndex) = _GLIBCXX_MOVE(*(__first + __secondChild));
          __holeIndex = __secondChild;
        }
      if ((__len & 1) == 0 && __secondChild == (__len - 2) / 2)
        {
          __secondChild = 2 * (__secondChild + 1);
          *(__first + __holeIndex) = _GLIBCXX_MOVE(*(__first
                                                     + (__secondChild - 1)));
          __holeIndex = __secondChild - 1;
        }
      __decltype(__gnu_cxx::__ops::__iter_comp_val(_GLIBCXX_MOVE(__comp)))
        __cmp(_GLIBCXX_MOVE(__comp));
      std::__push_heap(__first, __holeIndex, __topIndex,
                       _GLIBCXX_MOVE(__value), __cmp);
    }

  template<typename _RandomAccessIterator, typename _Compare>
    _GLIBCXX20_CONSTEXPR
    inline void
    __pop_heap(_RandomAccessIterator __first, _RandomAccessIterator __last,
               _RandomAccessIterator __result, _Compare& __comp)
    {
      typedef typename iterator_traits<_RandomAccessIterator>::value_type
        _ValueType;
      typedef typename iterator_traits<_RandomAccessIterator>::difference_type
        _DistanceType;

      _ValueType __value = _GLIBCXX_MOVE(*__result);
      *__result = _GLIBCXX_MOVE(*__first);
      std::__adjust_heap(__first, _DistanceType(0),
                         _DistanceType(__last - __first),
                         _GLIBCXX_MOVE(__value), __comp);
    }
