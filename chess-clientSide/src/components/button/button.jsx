import React from "react";
/*

 * This component renders a button element that can be used 
 * throughout the application. The component takes two props:
 * - onClick: a function that will be called when the button is clicked
 * - children: the content to be displayed inside the button, which can be text or other elements
*/

const Button = ({ onClick, children }) => {
    return (
        <button onClick={onClick} className="button">
            {children}
        </button>
    );
};

export default Button;

