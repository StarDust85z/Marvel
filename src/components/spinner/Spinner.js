const Spinner = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" style={{margin: '0 auto', background: 'none', display: 'block'}} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" fill="none" stroke="#912623" strokeWidth="12" r="29" strokeDasharray="136.659280431156 47.553093477052">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="3.125s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
            </circle>
        </svg>
    )
}

export default Spinner;