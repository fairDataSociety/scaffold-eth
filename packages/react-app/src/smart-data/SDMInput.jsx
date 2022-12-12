import { useState, useCallback, useEffect } from "react";
import { Input, Form, Button, notification, Card, Row, Spin, Select, Tooltip } from "antd";
import { SettingOutlined, EditOutlined, EllipsisOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Transactor } from "../helpers";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import * as FairOS from "../FDP/FairOS.js";
import { buildQueryFromSelectionSet } from "@apollo/client/utilities";
import { Components } from "antd/lib/date-picker/generatePicker";

/// TODO move to helpers
function toCapitalizedWords(name) {
  var words = name.match(/[A-Za-z][a-z]*/g) || [];
  return words.map(capitalize).join(" ");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}
/*
const smartDataModels = [
  {
    name: "ML Model",
    location: "MLModel",
    path: "smart-data-models/dataModel.MachineLearning/",
    category: "Machine Learning",
  },
  {
    name: "ML Processing",
    location: "MLProcessing",
    path: "smart-data-models/dataModel.MachineLearning/",
    category: "Machine Learning",
  },
  {
    name: "Subscription Query",
    location: "SubscriptionQuery",
    path: "smart-data-models/dataModel.MachineLearning/",
    category: "Machine Learning",
  },
];*/

const resources = {
  path: "smart-data-models",
  collections: [
    {
      categoryName: "Machine Learning",
      schemas: {
        group: "dataModel.MachineLearning",
        models: [{ subfolder: "MLModel" }, { subfolder: "MLProcessing" }, { subfolder: "SubscriptionQuery" }],
      },
    },
    {
      categoryName: "Risk Management",
      schemas: {
        group: "dataModel.RiskManagement",
        models: [
          { subfolder: "Asset" },
          { subfolder: "CyberAnalysis" },
          { subfolder: "Exposure" },
          { subfolder: "Hazard" },
          { subfolder: "Measure" },
          { subfolder: "Mitigation" },
          { subfolder: "NetworkServiceAlert" },
          { subfolder: "Risk" },
          { subfolder: "Vulnerability" },
        ],
      },
    },
    {
      categoryName: "Health HL7",
      schemas: {
        group: "dataModel.Hl7",
        models: [
          { subfolder: "Account" },
          { subfolder: "Citation" },
          { subfolder: "Immunization" },
          { subfolder: "Medication" },
          { subfolder: "Patient" },
          { subfolder: "Practitioner" },
        ],
      },
    },
    {
      categoryName: "Environment",
      schemas: {
        group: "dataModel.Environment",
        models: [
          { subfolder: "AeroAllergenObserved" },
          { subfolder: "AirQualityForecast" },
          { subfolder: "AirQualityMonitoring" },
          { subfolder: "AirQualityObserved" },
          { subfolder: "ElectroMagneticObserved" },
          { subfolder: "EnvironmentObserved" },
          { subfolder: "FloodMonitoring" },
          { subfolder: "IndoorEnvironmentObserved" },
          { subfolder: "MosquitoDensity" },
          { subfolder: "NoiseLevelObserved" },
          { subfolder: "NoisePollution" },
          { subfolder: "NoisePollutionForecast" },
          { subfolder: "PhreaticObserved" },
          { subfolder: "RainFallRadarObserved" },
          { subfolder: "TrafficEnvironmentImpact" },
          { subfolder: "TrafficEnvironmentImpactForecast" },
          { subfolder: "WaterObserved" },
        ],
      },
    },
    {
      categoryName: "Frictionless Data",
      schemas: {
        group: "dataModel.frictionlessData",
        models: [
          { subfolder: "CSVDialectFrictionlessData" },
          { subfolder: "DataPackageFrictionlessData" },
          { subfolder: "DataResourceFrictionlessData" },
          { subfolder: "TableSchemaFrictionlessData" },
        ],
      },
    },
    {
      categoryName: "Waste Management",
      schemas: {
        group: "dataModel.WasteManagement",
        models: [
          { subfolder: "WasteContainer" },
          { subfolder: "WasteContainerIsle" },
          { subfolder: "WasteContainerModel" },
          { subfolder: "WasteObserved" },
        ],
      },
    },
    {
      categoryName: "Water Quality",
      schemas: {
        group: "dataModel.WaterQuality",
        models: [{ subfolder: "WaterQualityObserved" }, { subfolder: "WaterQualityPredicted" }],
      },
    },
    {
      categoryName: "Weather",
      schemas: {
        group: "dataModel.Weather",
        models: [
          { subfolder: "SeaConditions" },
          { subfolder: "WeatherAlert" },
          { subfolder: "WeatherForecast" },
          { subfolder: "WeatherObserved" },
        ],
      },
    },
    {
      categoryName: "Energy",
      schemas: {
        group: "dataModel.Energy",
        models: [
          { subfolder: "ACMeasurement" },
          { subfolder: "InverterDevice" },
          { subfolder: "SolarEnergy" },
          { subfolder: "TechnicalCabinetDevice" },
          { subfolder: "ThreePhaseAcMeasurement" },
        ],
      },
    },
  ],
};

export default function SDMInput({ address, userSigner }) {
  const [inputSchema, setInputSchema] = useState(null);
  const [data, setData] = useState(null);
  //const [models, setModels] = useState(smartDataModels);
  const [dropCollections, setDropCollections] = useState([]);
  const [collection, setCollection] = useState([]);
  const [defaultGroupName, setDefaultGroupName] = useState("");

  const [options, setOptions] = useState([]);
  const [schema, setSchema] = useState({});
  const [example, setExample] = useState({});
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [license, setLicense] = useState("");
  const [version, setVersion] = useState("");
  const [modelTags, setModelTags] = useState("");
  const [form, setForm] = useState(<>Form</>);
  //const [form] = Form.useForm();

  async function handleCollectionChange(value) {
    console.log(`selected collection ${value}`);
    setCollection(value);
    return schema;
  }
  async function handleChangeGroup(value) {
    console.log(`selected group ${value}`);
    let schema = await (await fetch(value + "/schema.json")).json();
    setDescription(schema.description);
    setTitle(schema.title);
    setLicense(schema.license);
    setVersion(schema["$schemaVersion"]);
    setModelTags(schema.modelTags);
    setSchema(schema);

    console.log("handleChangeGroup schema", schema);
    let example = await (await fetch(value + "/examples/example.jsonld")).json();
    setExample(example);
    setDefaultGroupName(value);
    console.log("handleChangeGroup example", example);

    buildForm(example, schema);
    return schema;
  }
  useEffect(() => {
    const fetchData = async () => {
      if (options[0] === undefined) return;
      const data = await handleChangeGroup(options[0].value);
      return data;
    };
    const result = fetchData();
  }, [options]);

  useEffect(() => {
    let opt = [];
    console.log("useEffect on dropCollections", dropCollections);
  }, [dropCollections]);
  useEffect(() => {
    let opt = [];
    console.log("useEffect on collection", collection);
    resources.collections.map(c => {
      if (c.categoryName === collection) {
        c.schemas.models.map(s => {
          opt.push({
            label: toCapitalizedWords(s.subfolder),
            value: resources.path + "/" + c.schemas.group + "/" + s.subfolder,
            disabled: false,
          });
        });
        setDefaultGroupName(opt[0].value);
      }
    });
    setOptions(opt);
  }, [collection]);
  useEffect(() => {
    console.log("useEffect on defaultGroupName", defaultGroupName);
  }, [defaultGroupName]);

  useEffect(() => {
    let col = [];
    resources.collections.map(collection => {
      col.push({ label: collection.categoryName, value: collection.categoryName, disabled: false });
    });
    setDropCollections(col);
  }, []);

  //if (options.length === 0) return <div></div>;

  // function parseObject(something) {
  //   var keys = Object.keys(something);
  //   for (var i = 0; i < keys.length; i++) {
  //     if (typeof something[keys[i]] === "object") parseObject(something[keys[i]]);
  //     else console.log(keys[i] + " : " + something[keys[i]]);
  //   }
  // }

  function parseObjectToForm(object, components) {
    if (object === null || object === undefined) {
      console.log("object is null or undefined");
      return;
    }
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
      //console.log(typeof object[keys[i]] + ": " + keys[i] + " : " + object[keys[i]]);
      if (typeof object[keys[i]] === "object") {
        parseObjectToForm(object[keys[i]], components);
      } else if (typeof object[keys[i]] === "array") {
        //parseObjectToForm(object[keys[i]], components);
      } else {
        //console.log(keys[i] + " : " + object[keys[i]]);
        components.push(
          <Form.Item
            key={"i" + i}
            label=<Tooltip title={keys[i]} key={"t" + i}>
              {toCapitalizedWords(keys[i])}
            </Tooltip>
            style={{ margin: "1px" }}
          >
            <Input placeholder={object[keys[i]]} />
          </Form.Item>,
        );
      }
    }
  }

  async function buildForm(example, schema) {
    let components = [];
    // iterate through the schema and build the form as input components for each property
    parseObjectToForm(example, components);
    let form = (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} layout="horizontal">
        {components.map((component, index) => {
          return <>{component}</>;
        })}
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    );

    setForm(form);
  }

  return (
    <div style={{ alignItems: "left", textAlign: "left", margin: "10px" }}>
      <Card hoverable>
        <span style={{ position: "absolute", right: "2px", top: "-0px" }}>
          <small>
            {modelTags} {version}
          </small>
        </span>
        <h5>Select Schema</h5>
        <Select
          onChange={handleCollectionChange}
          options={dropCollections}
          style={{ width: 250 }}
          defaultValue={resources.collections[0].categoryName}
        />
        <Select onChange={handleChangeGroup} options={options} style={{ width: 250 }} value={defaultGroupName} />
      </Card>
      <Card hoverable>
        <h3 style={{ marginBottom: "2px", marginTop: "0px" }}>{title}</h3>
        <h4>{description}</h4>
        <h5>
          {license && (
            <Link to={license} target="_blank" rel="noopener noreferrer">
              License
            </Link>
          )}
        </h5>
        {form}
      </Card>
    </div>
  );
}
