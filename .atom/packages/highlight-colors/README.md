# highlight-colors

Simple and fast color highlighting. https://atom.io/packages/highlight-colors

![](https://i.imgur.com/hA0eFDc.png)

This package will display a color preview at the end of a line where a css-compatible color is found. That's it!

It also integrates with the [color-picker](https://atom.io/packages/color-picker) package. If this package is installed, clicking on the color preview will bring up the color picker for that color.

If you'd like to customize the color preview appearance, paste this into your styles.less to get started:

```css
:root {
  --highlight-color-size: 15px;
}

.highlight-color-container {
}

.highlight-color-item {
}
```
