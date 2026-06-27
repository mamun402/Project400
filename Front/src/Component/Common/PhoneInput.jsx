import React, { useEffect, useState } from "react";

export const COUNTRY_CODES = [
  { code: "+880", label: "Bangladesh", flag: "BD" },
  { code: "+93", label: "Afghanistan", flag: "AF" },
  { code: "+355", label: "Albania", flag: "AL" },
  { code: "+213", label: "Algeria", flag: "DZ" },
  { code: "+376", label: "Andorra", flag: "AD" },
  { code: "+244", label: "Angola", flag: "AO" },
  { code: "+54", label: "Argentina", flag: "AR" },
  { code: "+374", label: "Armenia", flag: "AM" },
  { code: "+61", label: "Australia", flag: "AU" },
  { code: "+43", label: "Austria", flag: "AT" },
  { code: "+994", label: "Azerbaijan", flag: "AZ" },
  { code: "+973", label: "Bahrain", flag: "BH" },
  { code: "+375", label: "Belarus", flag: "BY" },
  { code: "+32", label: "Belgium", flag: "BE" },
  { code: "+501", label: "Belize", flag: "BZ" },
  { code: "+229", label: "Benin", flag: "BJ" },
  { code: "+975", label: "Bhutan", flag: "BT" },
  { code: "+591", label: "Bolivia", flag: "BO" },
  { code: "+387", label: "Bosnia and Herzegovina", flag: "BA" },
  { code: "+267", label: "Botswana", flag: "BW" },
  { code: "+55", label: "Brazil", flag: "BR" },
  { code: "+673", label: "Brunei", flag: "BN" },
  { code: "+359", label: "Bulgaria", flag: "BG" },
  { code: "+226", label: "Burkina Faso", flag: "BF" },
  { code: "+257", label: "Burundi", flag: "BI" },
  { code: "+855", label: "Cambodia", flag: "KH" },
  { code: "+237", label: "Cameroon", flag: "CM" },
  { code: "+1", label: "Canada / United States", flag: "CA" },
  { code: "+238", label: "Cape Verde", flag: "CV" },
  { code: "+236", label: "Central African Republic", flag: "CF" },
  { code: "+235", label: "Chad", flag: "TD" },
  { code: "+56", label: "Chile", flag: "CL" },
  { code: "+86", label: "China", flag: "CN" },
  { code: "+57", label: "Colombia", flag: "CO" },
  { code: "+269", label: "Comoros", flag: "KM" },
  { code: "+242", label: "Congo", flag: "CG" },
  { code: "+506", label: "Costa Rica", flag: "CR" },
  { code: "+385", label: "Croatia", flag: "HR" },
  { code: "+53", label: "Cuba", flag: "CU" },
  { code: "+357", label: "Cyprus", flag: "CY" },
  { code: "+420", label: "Czech Republic", flag: "CZ" },
  { code: "+45", label: "Denmark", flag: "DK" },
  { code: "+253", label: "Djibouti", flag: "DJ" },
  { code: "+1", label: "Dominican Republic", flag: "DO" },
  { code: "+593", label: "Ecuador", flag: "EC" },
  { code: "+20", label: "Egypt", flag: "EG" },
  { code: "+503", label: "El Salvador", flag: "SV" },
  { code: "+240", label: "Equatorial Guinea", flag: "GQ" },
  { code: "+291", label: "Eritrea", flag: "ER" },
  { code: "+372", label: "Estonia", flag: "EE" },
  { code: "+251", label: "Ethiopia", flag: "ET" },
  { code: "+679", label: "Fiji", flag: "FJ" },
  { code: "+358", label: "Finland", flag: "FI" },
  { code: "+33", label: "France", flag: "FR" },
  { code: "+241", label: "Gabon", flag: "GA" },
  { code: "+220", label: "Gambia", flag: "GM" },
  { code: "+995", label: "Georgia", flag: "GE" },
  { code: "+49", label: "Germany", flag: "DE" },
  { code: "+233", label: "Ghana", flag: "GH" },
  { code: "+30", label: "Greece", flag: "GR" },
  { code: "+502", label: "Guatemala", flag: "GT" },
  { code: "+224", label: "Guinea", flag: "GN" },
  { code: "+245", label: "Guinea-Bissau", flag: "GW" },
  { code: "+592", label: "Guyana", flag: "GY" },
  { code: "+509", label: "Haiti", flag: "HT" },
  { code: "+504", label: "Honduras", flag: "HN" },
  { code: "+852", label: "Hong Kong", flag: "HK" },
  { code: "+36", label: "Hungary", flag: "HU" },
  { code: "+354", label: "Iceland", flag: "IS" },
  { code: "+91", label: "India", flag: "IN" },
  { code: "+62", label: "Indonesia", flag: "ID" },
  { code: "+98", label: "Iran", flag: "IR" },
  { code: "+964", label: "Iraq", flag: "IQ" },
  { code: "+353", label: "Ireland", flag: "IE" },
  { code: "+972", label: "Israel", flag: "IL" },
  { code: "+39", label: "Italy", flag: "IT" },
  { code: "+225", label: "Ivory Coast", flag: "CI" },
  { code: "+81", label: "Japan", flag: "JP" },
  { code: "+962", label: "Jordan", flag: "JO" },
  { code: "+7", label: "Kazakhstan / Russia", flag: "KZ" },
  { code: "+254", label: "Kenya", flag: "KE" },
  { code: "+965", label: "Kuwait", flag: "KW" },
  { code: "+996", label: "Kyrgyzstan", flag: "KG" },
  { code: "+856", label: "Laos", flag: "LA" },
  { code: "+371", label: "Latvia", flag: "LV" },
  { code: "+961", label: "Lebanon", flag: "LB" },
  { code: "+266", label: "Lesotho", flag: "LS" },
  { code: "+231", label: "Liberia", flag: "LR" },
  { code: "+218", label: "Libya", flag: "LY" },
  { code: "+423", label: "Liechtenstein", flag: "LI" },
  { code: "+370", label: "Lithuania", flag: "LT" },
  { code: "+352", label: "Luxembourg", flag: "LU" },
  { code: "+853", label: "Macau", flag: "MO" },
  { code: "+261", label: "Madagascar", flag: "MG" },
  { code: "+265", label: "Malawi", flag: "MW" },
  { code: "+60", label: "Malaysia", flag: "MY" },
  { code: "+960", label: "Maldives", flag: "MV" },
  { code: "+223", label: "Mali", flag: "ML" },
  { code: "+356", label: "Malta", flag: "MT" },
  { code: "+222", label: "Mauritania", flag: "MR" },
  { code: "+230", label: "Mauritius", flag: "MU" },
  { code: "+52", label: "Mexico", flag: "MX" },
  { code: "+373", label: "Moldova", flag: "MD" },
  { code: "+377", label: "Monaco", flag: "MC" },
  { code: "+976", label: "Mongolia", flag: "MN" },
  { code: "+382", label: "Montenegro", flag: "ME" },
  { code: "+212", label: "Morocco", flag: "MA" },
  { code: "+258", label: "Mozambique", flag: "MZ" },
  { code: "+95", label: "Myanmar", flag: "MM" },
  { code: "+264", label: "Namibia", flag: "NA" },
  { code: "+977", label: "Nepal", flag: "NP" },
  { code: "+31", label: "Netherlands", flag: "NL" },
  { code: "+64", label: "New Zealand", flag: "NZ" },
  { code: "+505", label: "Nicaragua", flag: "NI" },
  { code: "+227", label: "Niger", flag: "NE" },
  { code: "+234", label: "Nigeria", flag: "NG" },
  { code: "+47", label: "Norway", flag: "NO" },
  { code: "+968", label: "Oman", flag: "OM" },
  { code: "+92", label: "Pakistan", flag: "PK" },
  { code: "+507", label: "Panama", flag: "PA" },
  { code: "+675", label: "Papua New Guinea", flag: "PG" },
  { code: "+595", label: "Paraguay", flag: "PY" },
  { code: "+51", label: "Peru", flag: "PE" },
  { code: "+63", label: "Philippines", flag: "PH" },
  { code: "+48", label: "Poland", flag: "PL" },
  { code: "+351", label: "Portugal", flag: "PT" },
  { code: "+974", label: "Qatar", flag: "QA" },
  { code: "+40", label: "Romania", flag: "RO" },
  { code: "+7", label: "Russia", flag: "RU" },
  { code: "+250", label: "Rwanda", flag: "RW" },
  { code: "+685", label: "Samoa", flag: "WS" },
  { code: "+378", label: "San Marino", flag: "SM" },
  { code: "+239", label: "São Tomé and Príncipe", flag: "ST" },
  { code: "+966", label: "Saudi Arabia", flag: "SA" },
  { code: "+221", label: "Senegal", flag: "SN" },
  { code: "+381", label: "Serbia", flag: "RS" },
  { code: "+248", label: "Seychelles", flag: "SC" },
  { code: "+232", label: "Sierra Leone", flag: "SL" },
  { code: "+65", label: "Singapore", flag: "SG" },
  { code: "+421", label: "Slovakia", flag: "SK" },
  { code: "+386", label: "Slovenia", flag: "SI" },
  { code: "+27", label: "South Africa", flag: "ZA" },
  { code: "+82", label: "South Korea", flag: "KR" },
  { code: "+34", label: "Spain", flag: "ES" },
  { code: "+94", label: "Sri Lanka", flag: "LK" },
  { code: "+249", label: "Sudan", flag: "SD" },
  { code: "+597", label: "Suriname", flag: "SR" },
  { code: "+46", label: "Sweden", flag: "SE" },
  { code: "+41", label: "Switzerland", flag: "CH" },
  { code: "+963", label: "Syria", flag: "SY" },
  { code: "+886", label: "Taiwan", flag: "TW" },
  { code: "+992", label: "Tajikistan", flag: "TJ" },
  { code: "+255", label: "Tanzania", flag: "TZ" },
  { code: "+66", label: "Thailand", flag: "TH" },
  { code: "+228", label: "Togo", flag: "TG" },
  { code: "+676", label: "Tonga", flag: "TO" },
  { code: "+216", label: "Tunisia", flag: "TN" },
  { code: "+90", label: "Turkey", flag: "TR" },
  { code: "+993", label: "Turkmenistan", flag: "TM" },
  { code: "+256", label: "Uganda", flag: "UG" },
  { code: "+380", label: "Ukraine", flag: "UA" },
  { code: "+971", label: "United Arab Emirates", flag: "AE" },
  { code: "+44", label: "United Kingdom", flag: "GB" },
  { code: "+598", label: "Uruguay", flag: "UY" },
  { code: "+998", label: "Uzbekistan", flag: "UZ" },
  { code: "+678", label: "Vanuatu", flag: "VU" },
  { code: "+58", label: "Venezuela", flag: "VE" },
  { code: "+84", label: "Vietnam", flag: "VN" },
  { code: "+967", label: "Yemen", flag: "YE" },
  { code: "+260", label: "Zambia", flag: "ZM" },
  { code: "+263", label: "Zimbabwe", flag: "ZW" },
];

const digitsOnly = (value = "") => value.replace(/\D/g, "");

export const normalizePhoneNumber = (countryCode, nationalNumber) => {
  const localDigits = digitsOnly(nationalNumber);
  if (!localDigits) return "";

  if (countryCode === "+880") {
    const bdDigits = localDigits.startsWith("0")
      ? localDigits.slice(1)
      : localDigits;
    return `${countryCode}${bdDigits}`;
  }

  return `${countryCode}${localDigits}`;
};

export const splitPhoneNumber = (value = "", defaultCountryCode = "+880") => {
  const phoneValue = String(value || "").trim();
  const matchedCountry =
    COUNTRY_CODES.find((country) => phoneValue.startsWith(country.code)) ||
    COUNTRY_CODES.find((country) => country.code === defaultCountryCode) ||
    COUNTRY_CODES[0];

  if (!phoneValue) {
    return { countryCode: matchedCountry.code, nationalNumber: "" };
  }

  if (phoneValue.startsWith("+")) {
    const withoutCode = phoneValue.slice(matchedCountry.code.length);
    return {
      countryCode: matchedCountry.code,
      nationalNumber:
        matchedCountry.code === "+880" && withoutCode && !withoutCode.startsWith("0")
          ? `0${withoutCode}`
          : withoutCode,
    };
  }

  return { countryCode: matchedCountry.code, nationalNumber: phoneValue };
};

const getCountrySpecificPhoneError = (countryCode, nationalDigits, label) => {
  switch (countryCode) {
    case "+880":
      return /^1[3-9]\d{8}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Bangladesh number`;
    case "+91":
      return /^[6-9]\d{9}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Indian number`;
    case "+92":
      return /^3[0-9]\d{9}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Pakistan number`;
    case "+1":
      return /^\d{10}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid US/Canada number`;
    case "+44":
      return /^(7\d{9}|1\d{10}|2\d{8,9}|3\d{8,9}|4\d{8,9}|5\d{8,9}|6\d{8,9}|8\d{8,9}|9\d{8,9})$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid UK number`;
    case "+60":
      return /^1\d{8,9}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Malaysian number`;
    case "+971":
      return /^[5-9]\d{8}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid UAE number`;
    case "+966":
      return /^[5-9]\d{8}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Saudi Arabia number`;
    default:
      return nationalDigits.length >= 6 && nationalDigits.length <= 14
        ? ""
        : `${label} must be a valid international number`;
  }
};

export const getPhoneError = (value, label = "Mobile number", required = false) => {
  const phoneValue = String(value || "").trim();
  if (!phoneValue) return required ? `${label} is required` : "";

  const matchedCountry = COUNTRY_CODES.find((country) =>
    phoneValue.startsWith(country.code)
  );

  if (!matchedCountry) {
    return `${label} must include a valid country code`;
  }

  const nationalDigits = digitsOnly(phoneValue.slice(matchedCountry.code.length));
  return getCountrySpecificPhoneError(matchedCountry.code, nationalDigits, label);
};

export const phoneToWhatsAppPath = (value = "") => digitsOnly(value);

const PhoneInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  className = "",
}) => {
  const { countryCode: initialCountryCode, nationalNumber: initialNationalNumber } = splitPhoneNumber(value);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [nationalNumber, setNationalNumber] = useState(initialNationalNumber);

  useEffect(() => {
    const parsed = splitPhoneNumber(value);
    setCountryCode(parsed.countryCode);
    setNationalNumber(parsed.nationalNumber);
  }, [value]);

  const emitChange = (nextCountryCode, nextNationalNumber) => {
    setCountryCode(nextCountryCode);
    setNationalNumber(nextNationalNumber);
    onChange({
      target: {
        name,
        value: normalizePhoneNumber(nextCountryCode, nextNationalNumber),
      },
    });
  };

  return (
    <div className={className}>
      {label && (
        <label className="block mb-1 text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <select
          aria-label={`${label || name} country code`}
          value={countryCode}
          onChange={(e) => emitChange(e.target.value, nationalNumber)}
          className="w-32 px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={`${country.code}-${country.label}`} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name={name}
          placeholder="Enter phone number"
          value={nationalNumber}
          onChange={(e) => emitChange(countryCode, e.target.value)}
          required={required}
          className="min-w-0 flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
