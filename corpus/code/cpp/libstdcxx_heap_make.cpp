  template<typename _RandomAccessIterator, typename _Compare>
    _GLIBCXX20_CONSTEXPR
    void
    __make_heap(_RandomAccessIterator __first, _RandomAccessIterator __last,
                _Compare& __comp)
    {
      typedef typename iterator_traits<_RandomAccessIterator>::value_type
          _ValueType;
      typedef typename iterator_traits<_RandomAccessIterator>::difference_type
          _DistanceType;

      if (__last - __first < 2)
        return;

      const _DistanceType __len = __last - __first;
      _DistanceType __parent = (__len - 2) / 2;
      while (true)
        {
          _ValueType __value = _GLIBCXX_MOVE(*(__first + __parent));
          std::__adjust_heap(__first, __parent, __len, _GLIBCXX_MOVE(__value),
                             __comp);
          if (__parent == 0)
            return;
          __parent--;
        }
    }
