const TableTemplates = ({ children }) => {
    return (
        <table>
            <thead>{children}</thead>
        </table>
    );
};

TableTemplates.Head = () => {};
