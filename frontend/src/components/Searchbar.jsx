import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, Input, InputGroup, Button, InputRightElement } from '@chakra-ui/react';
import { Search } from '@mui/icons-material';
import { Encode } from 'owasp-java-encoder';

import { useSearchContext } from '../contexts/SearchContext';

const Searchbar = () => {
    const [searchText, setSearchText] = useState("");
    const { setSearch, setCanSearch } = useSearchContext();
    const navigate = useNavigate();

    // Handle input sanitization with DOMPurify
    const handleInput = (e) => {
        const sanitizedInput = DOMPurify.sanitize(e.target.value); 
        setSearchText(sanitizedInput);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCanSearch(true);
        setSearch(searchText);
        navigate(`/search`);
    };

    return (
        <Box display='flex' alignItems='center' justifyContent={{ base: 'center' }} py={{ base: 3, sm: 0 }} >
            <FormControl as='form' onSubmit={handleSubmit} width={{ base: '100%', sm: '20vw', md: '30vw' }} minWidth="200px" >
                <InputGroup size='md'>
                    <Input
                        name='search'
                        pr='4.5rem'
                        placeholder='Search for clothes...'
                        onInput={handleInput}
                    />
                    <InputRightElement width='4rem'>
                        <Button h='1.75rem' size='sm' variant='solid' colorScheme='facebook' onClick={handleSubmit} >
                            <Search />
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
        </Box>
    );
};

export default Searchbar;
