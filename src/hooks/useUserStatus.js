import { useState, useEffect } from "react";
import { nomoAuthHttp } from "nomo-webon-kit";

export default function useUserStatus() {
  const [userStatus, setUserStatus] = useState({
    isMember: false,
    isPromoter: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        setLoading(true);
        console.log("Fetching user status...");

        // ✅ Use an underscore for unused variable
        const { response, _ } = await nomoAuthHttp({
          method: "GET",
          url: "https://voo.one/backend/user-status"
        });

        // ✅ Ensure response is valid JSON
        const userData = JSON.parse(response);
        console.log("User status response:", userData);

        setUserStatus({
          isMember: Boolean(userData.is_member),
          isPromoter: Boolean(userData.is_promoter)
        });
      } catch (err) {
        console.error("Error fetching user status:", err);
        setError(err.message || "Failed to fetch user status");
        setUserStatus({ isMember: false, isPromoter: false });
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, []);

  return { userStatus, loading, error };
}
