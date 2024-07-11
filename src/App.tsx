import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [physicalStockContent, setPhysicalStockContent] = useState<string>('');
  const [dailyStockContent, setDailyStockContent] = useState<string>('');
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [comparisonDone, setComparisonDone] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null); // New state for file selection error

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFileContent: React.Dispatch<React.SetStateAction<string>>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const readDescriptions = (content: string, skipHeader: boolean): string[] => {
    const lines = content.split('\n');
    const descriptions = lines.slice(skipHeader ? 1 : 0).map(line => line.trim()).filter(line => line);
    return descriptions;
  };

  const compareFiles = () => {
    // Check if both files have been selected
    if (!physicalStockContent || !dailyStockContent) {
      setFileError('Please select both files before comparing.');
      setComparisonDone(false);  // Reset comparison done state
      return;
    }

    setFileError(null);  // Clear any previous errors

    const physicalStock = readDescriptions(physicalStockContent, true).sort();
    const dailyDescriptions = new Set(readDescriptions(dailyStockContent, true));

    const missing = physicalStock.filter(desc => !dailyDescriptions.has(desc));
    setMissingItems(missing);
    setComparisonDone(true);  // Set comparisonDone to true after comparison
  };

  return (
    <div className="App">
      <h1>Compare Daily Stock to Physical Stock</h1>
      <div>
        <label>
          Physical Stock File:
          <input type="file" onChange={(e) => handleFileChange(e, setPhysicalStockContent)} />
        </label>
      </div>
      <div>
        <label>
          Daily Stock File:
          <input type="file" onChange={(e) => handleFileChange(e, setDailyStockContent)} />
        </label>
      </div>
      <button onClick={compareFiles}>Compare</button>
      {fileError && <div className="error-message">{fileError}</div>} {/* Show file selection error */}
      {comparisonDone && !fileError && ( // Conditionally render the mismatches section
        <div>
          <h2>Mismatches found: {missingItems.length}</h2>
          <ul>
            {missingItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
