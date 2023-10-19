import Header from "./Header";
import Form from "./Form";

const Container = () => {
    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
            <div className="container max-w-screen-lg mx-auto">
                <div>
                    <Header />
                    <Form />
                </div>
            </div>
        </div>
    );
};

export default Container;
