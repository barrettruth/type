    struct __uninitialized_copy
    {
      template<typename _InputIterator, typename _ForwardIterator>
        static _ForwardIterator
        __uninit_copy(_InputIterator __first, _InputIterator __last,
                      _ForwardIterator __result)
        { return std::__do_uninit_copy(__first, __last, __result); }
    };

  template<>
    struct __uninitialized_copy<true>
    {
      // Overload for generic iterators.
      template<typename _InputIterator, typename _ForwardIterator>
        static _ForwardIterator
        __uninit_copy(_InputIterator __first, _InputIterator __last,
                      _ForwardIterator __result)
        {
          if (__unwrappable_niter<_InputIterator>::__value
                && __unwrappable_niter<_ForwardIterator>::__value)
            {
              __uninit_copy(std::__niter_base(__first),
                            std::__niter_base(__last),
                            std::__niter_base(__result));
              std::advance(__result, std::distance(__first, __last));
              return __result;
            }
          else
            return std::__do_uninit_copy(__first, __last, __result);
        }

      // Overload for pointers.
      template<typename _Tp, typename _Up>
        static _Up*
        __uninit_copy(_Tp* __first, _Tp* __last, _Up* __result)
        {
          // Ensure that we don't successfully memcpy in cases that should be
          // ill-formed because is_constructible<_Up, _Tp&> is false.
          typedef __typeof__(static_cast<_Up>(*__first)) __check
            __attribute__((__unused__));

          const ptrdiff_t __n = __last - __first;
          if (__builtin_expect(__n > 0, true))
            {
              __builtin_memcpy(__result, __first, __n * sizeof(_Tp));
              __result += __n;
            }
          return __result;
        }
    };
