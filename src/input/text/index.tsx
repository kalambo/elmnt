import * as React from 'react';
import { branch, compose, lifecycle, withHandlers, withProps, withState } from 'recompose';
import { mapStyle } from 'highstyle';

import { Comp, Obj } from '../../typings';
import { clickFocus } from '../../utils';

import parsers from './parsers';

export default function createText({ Label }: Obj<Comp<any>>) {
  return compose<any, any>(

    clickFocus,

    withState(
      'textState', 'setTextState',
      props => ({
        text: parsers[props.type].format(props.value, {}, props),
        options: {},
        parsing: false,
      }),
    ),

    withHandlers({
      onTextChange: (props: any) => (inputText: string) => {
        const { type, onChange, textState, setTextState } = props;
        if (!inputText) {
          setTextState(
            { text: '', options: textState.options, parsing: true },
            () => onChange(null),
          );
        } else {
          const { value, text, options } = parsers[type].parse(inputText, props);
          setTextState(
            { text, options, parsing: true },
            () => onChange(value),
          );
        }
      },
    }),

    lifecycle({
      componentWillReceiveProps(nextProps) {
        const { type, value, textState, setTextState } = this.props;
        if (value !== nextProps.value) {
          if (textState.parsing) {
            setTextState({ ...textState, parsing: false });
          } else if (!(parsers[type].allowNull && (nextProps.value === null))) {
            setTextState({
              ...textState,
              text: parsers[type].format(nextProps.value, textState.options, nextProps),
            });
          }
        }
      },
    }),

    withProps(({ value, textState }) => ({
      isNull: textState.text ? (value === null) : null,
      text: textState.text,
    })),

    branch(
      ({ password }) => password,
      withProps(() => ({
        icon: ['', 'lock'],
      })),
    ),

    branch(
      ({ type }) => type === 'date',
      withProps(({ isNull, placeholder, noDay }) => ({
        placeholder: placeholder || (noDay ? 'MM/YY' : 'DD/MM/YY'),
        icon: (isNull !== null) && ['', isNull ? 'remove' : 'ok'],
      })),
    ),

    mapStyle(({ isFocused }) => [
      ['mergeKeys', { active: isFocused }],
      ['merge', { cursor: 'text' }],
    ]),

  )(({
    text, onTextChange, icon, password, onMouseDown, hoverProps, focusProps, setFocusElem, style
  }) =>
    <div onMouseDown={onMouseDown} {...hoverProps}>
      <Label
        text={text} onTextChange={onTextChange} icon={icon} password={password}
        focusProps={focusProps} setFocusElem={setFocusElem} style={style}
      />
    </div>
  );
}