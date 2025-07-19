import { Input, InputGroup, Kbd } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

const Search = () => (
  <InputGroup flex="1" startElement={<LuSearch className="!text-black "/>} >
    <Input placeholder="Search contacts" />
  </InputGroup>
)

export default Search;
