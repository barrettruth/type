#if __cplusplus >= 201103L
      using _Dest = decltype(std::__niter_base(__result));
      using _Src = decltype(std::__niter_base(__first));
      using _ValT = typename iterator_traits<_ForwardIterator>::value_type;

#if __glibcxx_raw_memory_algorithms >= 202411L // >= C++26
      if consteval {
        return std::__do_uninit_copy(__first, __last, __result);
      }
#endif
      if constexpr (!__is_trivially_constructible(_ValT, decltype(*__first)))
        return std::__do_uninit_copy(__first, __last, __result);
      else if constexpr (__memcpyable<_Dest, _Src>::__value)
        {
          ptrdiff_t __n = __last - __first;
          if (__n > 0) [[__likely__]]
            {
              using _ValT = typename remove_pointer<_Src>::type;
              __builtin_memcpy(std::__niter_base(__result),
                               std::__niter_base(__first),
                               __n * sizeof(_ValT));
              __result += __n;
            }
          return __result;
        }
#if __cpp_lib_concepts
      else if constexpr (contiguous_iterator<_ForwardIterator>
                           && contiguous_iterator<_InputIterator>)
        {
          using _DestPtr = decltype(std::to_address(__result));
          using _SrcPtr = decltype(std::to_address(__first));
          if constexpr (__memcpyable<_DestPtr, _SrcPtr>::__value)
            {
              if (auto __n = __last - __first; __n > 0) [[likely]]
                {
                  void* __dest = std::to_address(__result);
                  const void* __src = std::to_address(__first);
                  size_t __nbytes = __n * sizeof(remove_pointer_t<_DestPtr>);
                  __builtin_memcpy(__dest, __src, __nbytes);
                  __result += __n;
                }
              return __result;
            }
          else
            return std::__do_uninit_copy(__first, __last, __result);
        }
#endif
      else
        return std::__do_uninit_copy(__first, __last, __result);
#else // C++98
      typedef typename iterator_traits<_InputIterator>::value_type
        _ValueType1;
      typedef typename iterator_traits<_ForwardIterator>::value_type
        _ValueType2;

      const bool __can_memcpy
        = __memcpyable<_ValueType1*, _ValueType2*>::__value
            && __is_trivially_constructible(_ValueType2, __decltype(*__first));

      return __uninitialized_copy<__can_memcpy>::
               __uninit_copy(__first, __last, __result);
#endif
    }
