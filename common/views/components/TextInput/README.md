## Purpose
To display a text input and any relevant validation UI/messaging to the user.

### Notes
- The label minifies if input has focus
- The label remains minified when input is blurred as long as some value is entered
- The label is always minified if user doesn't have JS
- The input will validate when it is blurred or the form it lives in is submitted (either shows error state or 'valid' checkmark)
- The input will hide any error at the point when it becomes valid and won't re-check for errors until it is blurred
- The input will hide valid checkmark if it receives new input and won't revalidate until it is blurred

[Edit this on GitHub](https://github.com/wellcomecollection/wellcomecollection.org/edit/master/common/views/components/TextInput/README.md)

[View this on Zeplin](https://zpl.io/VQDJKEn)
