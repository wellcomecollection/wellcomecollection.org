import React from 'react';

let what_debug_changed = 0;

/**
 * stackoverflow random color logic
 */
const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 *
 * Check whether the dependency item is an object.
 */
const isObject = (t: any) =>
  Object.prototype.toString.call(t) === '[object Object]';

const getPrintableInfo = (dependencyItem: any) => {
  /**
   * Printing the info into viewable format
   */
  if (isObject(dependencyItem) || Array.isArray(dependencyItem)) {
    let ans;
    try {
      ans = JSON.stringify(dependencyItem, null, 2);
    } catch (e) {
      ans = 'CIRCULAR JSON';
    }
    return ans;
  }

  return dependencyItem;
};

const useHotRefs = (value: any) => {
  const fnRef = React.useRef(value);
  React.useEffect(() => {
    fnRef.current = value;
  });

  return fnRef;
};

/**
 * @description the function will print the debug logs in the browser console, please make sure to not keep this function in in prod builds!
 * @param dependency the dependency array to observe
 * @param dependencyNames a comma separated string that matches the dependencies to observe for better developer experience while debugging
 * @param isUseLayoutEffect since useEffect and useLayoutEffect work slightly different this optional boolean is here
 *
 * @example <caption>Example usage with regular hooks with dependency arrays.</caption>
 * const [a, setA] = React.useState(0);
 * const [b, setB] = React.useState(0);
 * const [c, setC] = React.useState(0);
 *
 * // Just place the useWhatChanged hook call with dependency before your
 * // useEffect, useCallback or useMemo
 *
 * useWhatChanged([a, b, c]); // debugs the below useEffect
 * React.useEffect(() => {
 *   // console.log("why am I running?")
 * }, [a, b, c]);
 *
 * @example <caption>Example usage for useLayoutEffect.</caption>
 * const [count, setCount] = React.useState(0);
 * const [current, setCurrent] = React.useState('');
 *
 * useWhatChanged([count, current], 'count, current', true); // debugs the below useEffect
 * React.useLayoutEffect(() => {
 *   // blah
 * }, [count, current]);
 */
export const useWhatHasUpdated = (
  dependency: any[],
  dependencyNames?: string,
  isUseLayoutEffect?: boolean
) => {
  // It's a fair assumption the hooks type will not change for a component during
  // its life time
  const hookNameFinal = React.useMemo(() => {
    if (isUseLayoutEffect) {
      return 'useLayoutEffect';
    }
    return 'useEffect';
  }, []);
  // This ref is responsible for book keeping of the old value
  const dependencyRef = React.useRef(dependency);

  // For count bookkeeping , for easy debugging
  const whatChangedHookCountRef = React.useRef(1);

  // For assigning color for easy debugging
  const backgroundColorRef = React.useRef('');

  let isDependencyArr = Array.isArray(dependencyRef.current);

  React[hookNameFinal](() => {
    if (dependencyRef.current && isDependencyArr) {
      what_debug_changed++;

      whatChangedHookCountRef.current = what_debug_changed;
      backgroundColorRef.current = getRandomColor();
    }

    // const MyWindow: IWindow = window;
  }, [dependencyRef, isDependencyArr]);

  const postConsole = () => {
    console.log('\n');
    console.log(
      `%c///// END SECTION/////`,
      `background: ${backgroundColorRef.current}; color: white; font-size: 10px`,
      '\n'
    );
    console.log('\n');
    console.log('\n');
  };
  const logBanners = ({
    isFirstMount,
    suffixText,
    isBlankArrayAsDependency,
  }: {
    isFirstMount?: boolean;
    suffixText?: string;
    isBlankArrayAsDependency?: boolean;
  }) => {
    console.log(
      `%c///// START SECTION /////`,
      `background: ${backgroundColorRef.current}; color: white; font-size: 10px`,
      '\n'
    );
    console.log('\n');
    console.log(
      `%c ${whatChangedHookCountRef.current}`,
      `background: ${backgroundColorRef.current}; color: white; font-size: 10px`,
      '👇🏾',
      `${isFirstMount ? 'FIRST RUN' : 'UPDATES'}`,
      `${suffixText}`
    );

    if (isBlankArrayAsDependency) {
      postConsole();
    }
  };

  const longBannersRef = useHotRefs(logBanners);

  React[hookNameFinal](() => {
    if (!(dependencyRef.current && isDependencyArr)) {
      return;
    }

    // More info, if needed
    const stringSplitted = dependencyNames ? dependencyNames.split(',') : null;
    let changed = false;
    const whatChanged = dependency
      ? dependency.reduce((acc, dep, index) => {
          if (dependencyRef.current && dep !== dependencyRef.current[index]) {
            const oldValue = dependencyRef.current[index];
            dependencyRef.current[index] = dep;
            if (dependencyNames && stringSplitted) {
              changed = true;
              acc[`"✅" ${stringSplitted[index]}`] = {
                'Old Value': getPrintableInfo(oldValue),
                'New Value': getPrintableInfo(dep),
              };
            } else {
              acc[`"✅" ${index}`] = {
                'Old Value': getPrintableInfo(oldValue),
                'New Value': getPrintableInfo(dep),
              };
            }

            return acc;
          }
          if (dependencyNames && stringSplitted) {
            acc[`"⏺" ${stringSplitted[index]}`] = {
              'Old Value': getPrintableInfo(dep),
              'New Value': getPrintableInfo(dep),
            };
          } else {
            acc[`"⏺" ${index}`] = {
              'Old Value': getPrintableInfo(dep),
              'New Value': getPrintableInfo(dep),
            };
          }

          return acc;
        }, {})
      : {};

    const isBlankArrayAsDependency =
      whatChanged && Object.keys(whatChanged).length === 0 && isDependencyArr;
    longBannersRef.current({
      isFirstMount: !changed,
      suffixText: isBlankArrayAsDependency
        ? ` 👉🏽 This will run only once on mount.`
        : ``,
      isBlankArrayAsDependency,
    });

    if (!isBlankArrayAsDependency) {
      console.table(whatChanged);
      postConsole();
    }
  }, [
    ...(() => {
      if (dependency && isDependencyArr) {
        return dependency;
      }
      return [];
    })(),
    dependencyRef,
    longBannersRef,
    isUseLayoutEffect,
  ]);
};
