import * as React from 'react';
import { compose } from 'recompose';
import { mapStyle } from 'highstyle';

import Div from '../../div';
import Txt from '../../txt';
import { cssGroups } from '../../utils';

import Icon from './Icon';

export default compose<any, any>(

  mapStyle(() => [
    ['numeric', 'fontSize', 'iconSize', 'paddingLeft', 'paddingRight'],
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
        paddingTop: Math.round((fontSize - iconSize) * 0.5),
        paddingBottom: Math.round((fontSize - iconSize) * 0.5),
        paddingRight: icon && icon[0] && paddingLeft,
        paddingLeft: icon && !icon[0] && paddingRight,
      }],
    ],
    text: [
      ['filter', ...cssGroups.text],
    ],
  })),

)(({ text, icon, password, onTextChange, onMouseDown, focusProps, setFocusElem, style }) =>
  <Div onMouseDown={onMouseDown} style={style.div}>
    {(icon || ['']).map(i => i ?
      <Icon type={i} style={style.icon} key={i} /> :
      <Txt
        onTextChange={onTextChange} {...focusProps} focusRef={setFocusElem}
        password={password} style={style.text} key={i} children={text}
      />
    )}
  </Div>
);
