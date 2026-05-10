import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://provinces.open-api.vn/api";

export function useVietnamProvinces() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });

  // Fetch all provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        const response = await axios.get(`${API_BASE}/p/`);
        setProvinces(response.data);
      } catch (error) {
        console.error("Failed to fetch provinces", error);
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };
    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceCode) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const response = await axios.get(`${API_BASE}/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts || []);
      setWards([]); // Clear wards when province changes
    } catch (error) {
      console.error("Failed to fetch districts", error);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchWards = async (districtCode) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    setLoading(prev => ({ ...prev, wards: true }));
    try {
      const response = await axios.get(`${API_BASE}/d/${districtCode}?depth=2`);
      setWards(response.data.wards || []);
    } catch (error) {
      console.error("Failed to fetch wards", error);
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  return {
    provinces,
    districts,
    wards,
    loading,
    fetchDistricts,
    fetchWards,
  };
}
