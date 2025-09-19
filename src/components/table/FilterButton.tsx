import React from "react";
import { Box } from "zmp-ui";
import { Icon } from "@iconify/react";

interface FilterButtonProps {
    onClick?: () => void;
    showFilter: boolean
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, showFilter }) => {

    return (
        <Box onClick={onClick}>
            <Box flex alignItems="center" className="gap-2">
                <Icon icon={!showFilter ? 'mage:filter' : 'mage:filter-fill'} fontSize={24} className="text-heading-color" />
            </Box>
        </Box>
    );
};

export default FilterButton;
