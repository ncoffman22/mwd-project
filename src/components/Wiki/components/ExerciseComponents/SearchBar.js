import React, { useCallback, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import debounce from 'lodash/debounce';

const SearchBar = ({ value, onChange }) => {
    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            onChange(searchTerm);
        }, 300),
        [onChange]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleChange = (e) => {
        const searchTerm = e.target.value;
        e.persist();
        debouncedSearch(searchTerm);
    };

    return (
        <Form.Group className="mb-3">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Search exercises..."
                    defaultValue={value}
                    onChange={handleChange}
                />
            </InputGroup>
        </Form.Group>
    );
};
export default SearchBar;