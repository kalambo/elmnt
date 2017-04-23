import * as React from 'react';
import { compose } from 'recompose';
import { mapStyle } from 'highstyle';

import Div from '../../div';
import Txt from '../../txt';
import { cssGroups } from '../../utils';

import Marker from './Marker';

export default compose<any, any>(

  mapStyle(() => [
    ['numeric', 'fontSize', 'paddingLeft', 'paddingRight'],
    ['scale', { fontSize: { iconSize: 0.9 } }]
  ]),

  mapStyle(({ icon, style: { fontSize, iconSize, paddingLeft, paddingRight, cursor } }) => ({
    div: [
      ['filter', ...cssGroups.box, ...cssGroups.other],
      ['merge', {
        layout: 'bar', spacing: 0, width: '100%',
        cursor: cursor || 'pointer',
        childWidths: icon &&
          icon[0] ? iconSize + paddingLeft : `auto ${iconSize + paddingRight}px`,
      }],
    ],
    icon: [
      ['filter', 'color'],
      ['merge', {
        fontSize: iconSize,
        paddingTop: (fontSize - iconSize) * 0.5,
        paddingBottom: (fontSize - iconSize) * 0.5,
        paddingRight: icon && icon[0] && paddingLeft,
        paddingLeft: icon && !icon[0] && paddingRight,
      }],
    ],
    text: [
      ['filter', ...cssGroups.text],
    ],
  })),

)(({ text, icon, password, onTextChange, focusProps, setFocusElem, style }) =>
  <Div style={style.div}>
    {(icon || ['']).map(i => i ?
      <Marker type={i} style={style.icon} key={i} /> :
      <Txt
        onTextChange={onTextChange} {...focusProps} focusRef={setFocusElem}
        password={password} style={style.text} key={i} children={text}
      />
    )}
  </Div>
);