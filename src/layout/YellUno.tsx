import * as React from 'react'
import '../css/general.css'

interface Props {
    onClick: () => void;
}

export const YellUno = ({onClick}: Props) =>
    <div style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-evenly',
        height: '100%',
        width: '100%'
    }}>
        <button className={'green-button'} onClick={onClick}>Yell Uno!</button>
    </div>;