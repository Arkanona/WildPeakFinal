import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

function CustomDropdown({
    label,
    icon,
    options,
    value,
    onChange
}) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedOption = options.find(
        (option) => option.value === value
    )

    const handleSelect = (optionValue) => {
        onChange(optionValue)
        setIsOpen(false)
    }

    return (
        <div className="customDropdown">
            <button
                type="button"
                className="dropdownButton"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>
                    {icon && (
                        <FontAwesomeIcon icon={icon} />
                    )}
                    {selectedOption?.label || label}
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
                            onClick={() =>handleSelect(option.value)}>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CustomDropdown