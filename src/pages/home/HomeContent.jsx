import Files from "./Files";
import { SearchResults } from "./search/Search";

function HomeContent({ searchState }) {
    if (searchState.isLoading) {
        return <></>
    }

    if (searchState.results !== null) {
        return <SearchResults results={searchState.results} />;
    }

    return <Files />;
}

export default HomeContent;
