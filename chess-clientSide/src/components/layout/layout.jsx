import React from "react";
import "./layout-style.css";

const Layout = ({ Content }) => {
    return (
        <div className="container">
            <div className="title">Chess React</div>
            <div className="flex">
                <div className="content">
                    <Content />
                </div>
            </div>
        </div>
    );
};

export default Layout;
