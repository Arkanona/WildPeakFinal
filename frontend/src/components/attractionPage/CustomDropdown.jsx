import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

function CustomDropdown({
    label,
    icon,
    options,
    value,
    onChange,
    isOpen,
    onToggle
}) {

    const selectedOption = options.find(
        (option) => option.value === value
    )

    const handleSelect = (optionValue) => {
        onChange(optionValue)
        onToggle()
    }

    return (
        <div className="customDropdown">
            <button
                type="button"
                className="dropdownButton"
                onClick={onToggle}
            >
                <span>
                    {icon && (
                        <FontAwesomeIcon icon={icon} />
                    )}
                    {value === '' ? label : selectedOption?.label}
                </span>
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {isOpen && (
                <div className="dropdownMenu">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={value === option.value ? 'active' : ''}
                            onClick={() => handleSelect(option.value)}>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CustomDropdown