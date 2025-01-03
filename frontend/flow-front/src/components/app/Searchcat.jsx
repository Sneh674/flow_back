import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Searchcat = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id: userId, subCategory } = useParams();

  const fetchSearchResult = async (token) => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/home/getSearchCat/${subCategory}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(resp.data.response);
      setResults(resp.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    fetchSearchResult(token);
  }, [subCategory, navigate]);

  return (
    <div className="p-5 bg-gray-800 text-white min-h-screen">
      <button
        onClick={() => {
          navigate(`/home/${userId}`);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Go Back
      </button>

      {loading ? (
        <div className="text-center text-gray-300">Loading...</div>
      ) : (
        <div>
          {results.length > 0 ? (
            <div>
              {results.map((category, index) => (
                <div key={index} className="mb-6">
                  {category.subCategories.map((subCategory, idx) => (
                    <div key={idx} className="bg-slate-600 p-3 rounded-md my-4">
                      <h3 className="font-bold text-xl">{category.flowType}</h3>
                      <h4 className="font-semibold text-lg">{subCategory.name}</h4>
                      <p className="text-sm text-gray-300">{subCategory.description}</p>

                      {/* Show budget only if flowType is Outflow or contains 'outflow' */}
                      {(category.flowType.toLowerCase() === "outflow" || category.flowType.toLowerCase().includes("outflow")) && (
                        <p className="text-sm text-green-300">Budget: {subCategory.budget}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-300">No matching categories found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchcat;