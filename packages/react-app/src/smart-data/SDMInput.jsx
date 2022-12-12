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
    {
      categoryName: "Green Energy",
      schemas: {
        group: "dataModel.GreenEnergy",
        models: [
          { subfolder: "GreenEnergyGenerator" },
          { subfolder: "GreenEnergyMeasurement" },
          { subfolder: "PhotovoltaicDevice" },
          { subfolder: "PhotovoltaicMeasurement" },
        ],
      },
    },
    {
      categoryName: "Battery",
      schemas: {
        group: "dataModel.Battery",
        models: [
          { subfolder: "Battery" },
          { subfolder: "BatteryStatus" },
          { subfolder: "StorageBatteryDevice" },
          { subfolder: "StorageBatteryMeasurement" },
        ],
      },
    },
    {
      categoryName: "Consumption",
      schemas: {
        group: "dataModel.Consumption",
        models: [{ subfolder: "ConsumptionCost" }, { subfolder: "ConsumptionPoint" }],
      },
    },
    {
      categoryName: "Transportation",
      schemas: {
        group: "dataModel.Transportation",
        models: [
          { subfolder: "AnonymousCommuterId" },
          { subfolder: "BikeHireDockingStation" },
          { subfolder: "BikeLane" },
          { subfolder: "CityWork" },
          { subfolder: "CrowdFlowObserved" },
          { subfolder: "EVChargingStation" },
          { subfolder: "FareCollectionSystem" },
          { subfolder: "FleetVehicle" },
          { subfolder: "FleetVehicleOperation" },
          { subfolder: "FleetVehicleStatus" },
          { subfolder: "ItemFlowObserved" },
          { subfolder: "RestrictedTrafficArea" },
          { subfolder: "RestrictionException" },
          { subfolder: "Road" },
          { subfolder: "RoadAccident" },
          { subfolder: "RoadSegment" },
          { subfolder: "SpecialRestriction" },
          { subfolder: "TrafficFlowObserved" },
          { subfolder: "TrafficViolation" },
          { subfolder: "TransportStation" },
          { subfolder: "Vehicle" },
          { subfolder: "VehicleFault" },
          { subfolder: "VehicleModel" },
        ],
      },
    },
    {
      categoryName: "Agrifood",
      schemas: {
        group: "dataModel.Agrifood",
        models: [
          { subfolder: "AgriApp" },
          { subfolder: "AgriCrop" },
          { subfolder: "AgriFarm" },
          { subfolder: "AgriGreenhouse" },
          { subfolder: "AgriParcel" },
          { subfolder: "AgriParcelOperation" },
          { subfolder: "AgriParcelRecord" },
          { subfolder: "AgriPest" },
          { subfolder: "AgriProductType" },
          { subfolder: "AgriSoil" },
          { subfolder: "Animal" },
          { subfolder: "AnimalDisease" },
          { subfolder: "AnimalMovement" },
          { subfolder: "Carcass" },
          { subfolder: "Compartment" },
          { subfolder: "FeedRegistry" },
          { subfolder: "MeatProduct" },
          { subfolder: "Pen" },
          { subfolder: "VeterinarianTreatment" },
        ],
      },
    },
    {
      categoryName: "Aquaculture",
      schemas: {
        group: "dataModel.Aquaculture",
        models: [
          { subfolder: "Feed" },
          { subfolder: "Feeder" },
          { subfolder: "FeedingOperation" },
          { subfolder: "FishPopulation" },
        ],
      },
    },
    {
      categoryName: "Urban Mobility",
      schemas: {
        group: "dataModel.UrbanMobility",
        models: [
          { subfolder: "ArrivalEstimation" },
          { subfolder: "GtfsAccessPoint" },
          { subfolder: "GtfsAgency" },
          { subfolder: "GtfsCalendarDateRule" },
          { subfolder: "GtfsCalendarRule" },
          { subfolder: "GtfsFrequency" },
          { subfolder: "GtfsRoute" },
          { subfolder: "GtfsService" },
          { subfolder: "GtfsShape" },
          { subfolder: "GtfsStation" },
          { subfolder: "GtfsStop" },
          { subfolder: "GtfsStopTime" },
          { subfolder: "GtfsTransferRule" },
          { subfolder: "GtfsTrip" },
          { subfolder: "PublicTransportRoute" },
          { subfolder: "PublicTransportStop" },
          { subfolder: "TransitManagement" },
        ],
      },
    },
    {
      categoryName: "Streetlighting",
      schemas: {
        group: "dataModel.Streetlighting",
        models: [
          { subfolder: "Streetlight" },
          { subfolder: "StreetlightControlCabinet" },
          { subfolder: "StreetlightFeeder" },
          { subfolder: "StreetlightGroup" },
          { subfolder: "StreetlightModel" },
        ],
      },
    },
    {
      categoryName: "Ports",
      schemas: {
        group: "dataModel.Ports",
        models: [
          { subfolder: "BoatAuthorized" },
          { subfolder: "BoatPlacesAvailable" },
          { subfolder: "BoatPlacesPricing" },
          { subfolder: "SeaportFacilities" },
        ],
      },
    },
    {
      categoryName: "Point Of Interest",
      schemas: {
        group: "dataModel.PointOfInterest",
        models: [
          { subfolder: "Beach" },
          { subfolder: "Museum" },
          { subfolder: "PointOfInterest" },
          { subfolder: "Store" },
        ],
      },
    },
    {
      categoryName: "Parks And Gardens",
      schemas: {
        group: "dataModel.ParksAndGardens",
        models: [
          { subfolder: "FlowerBed" },
          { subfolder: "Garden" },
          { subfolder: "PointOfInterest" },
          { subfolder: "GreenspaceRecord" },
        ],
      },
    },
    {
      categoryName: "Parking",
      schemas: {
        group: "dataModel.Parking",
        models: [
          { subfolder: "OffStreetParking" },
          { subfolder: "OnStreetParking" },
          { subfolder: "ParkingAccess" },
          { subfolder: "ParkingGroup" },
          { subfolder: "ParkingSpot" },
        ],
      },
    },
    {
      categoryName: "Building",
      schemas: {
        group: "dataModel.Building",
        models: [
          { subfolder: "Building" },
          { subfolder: "BuildingOperation" },
          // { subfolder: "Enclosure_incubated" },
          // { subfolder: "Floor_incubated" },
          { subfolder: "VibrationsObserved" },
        ],
      },
    },
    {
      categoryName: "OSLO",
      schemas: {
        group: "dataModel.OSLO",
        models: [
          { subfolder: "BicycleParkingStation" },
          { subfolder: "BicycleParkingStationForecast" },
          { subfolder: "ResourceReport" },
          { subfolder: "ResourceReportForecast" },
        ],
      },
    },
    {
      categoryName: "TourismDestinations",
      schemas: {
        group: "dataModel.TourismDestinations",
        models: [{ subfolder: "Event" }, { subfolder: "TouristDestination" }, { subfolder: "TouristTrip" }],
      },
    },
    {
      categoryName: "Device",
      schemas: {
        group: "dataModel.Device",
        models: [
          { subfolder: "Camera" },
          { subfolder: "Device" },
          { subfolder: "DeviceMeasurement" },
          { subfolder: "DeviceModel" },
          { subfolder: "DeviceOperation" },
          { subfolder: "PrivacyObject" },
          { subfolder: "SmartMeteringObservation" },
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
            //label: toCapitalizedWords(s.subfolder),
            label: s.subfolder,
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

/*
 // CIM models do not have examples 
,
    {
      categoryName: "Energy Accumulator CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Accumulator" },
          { subfolder: "AccumulatorLimit" },
          { subfolder: "AccumulatorLimitSet" },
          { subfolder: "AccumulatorReset" },
        ],
      },
    },
    {
      categoryName: "Energy ACDC CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "ACDCConverter" }, { subfolder: "ACDCConverterDCTerminal" }],
      },
    },
    {
      categoryName: "Energy Active CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "ActivePower" },
          { subfolder: "ActivePowerLimit" },
          { subfolder: "ActivePowerPerCurrentFlow" },
          { subfolder: "ActivePowerPerFrequency" },
        ],
      },
    },
    {
      categoryName: "Energy Analog CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Analog" },
          { subfolder: "AnalogControl" },
          { subfolder: "AnalogLimit" },
          { subfolder: "AnalogLimitSet" },
          { subfolder: "AnalogValue" },
          { subfolder: "AngleDegrees" },
          { subfolder: "AngleRadians" },
        ],
      },
    },
    {
      categoryName: "Energy Apparent CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "ApparentPower" }, { subfolder: "ApparentPowerLimit" }, { subfolder: "Area" }],
      },
    },
    {
      categoryName: "Energy Asynchronous CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "AsynchronousMachine" },
          { subfolder: "AsynchronousMachineDynamics" },
          { subfolder: "AsynchronousMachineEquivalentCircuit" },
          { subfolder: "AsynchronousMachineTimeConstantReactance" },
          { subfolder: "AsynchronousMachineUserDefined" },
        ],
      },
    },
    {
      categoryName: "Energy Base CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "BaseVoltage" },
          { subfolder: "BasicIntervalSchedule" },
          { subfolder: "Bay" },
          { subfolder: "BusbarSection" },
          { subfolder: "BusNameMarker" },
        ],
      },
    },
    {
      categoryName: "Energy Capacitance CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "Capacitance" }, { subfolder: "CapacitancePerLength" }, { subfolder: "Command" }],
      },
    },
    {
      categoryName: "Energy Conductance CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "Conductance" }, { subfolder: "ConductingEquipment" }, { subfolder: "Conductor" }],
      },
    },
    {
      categoryName: "Energy Conform CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "ConformLoad" }, { subfolder: "ConformLoadGroup" }, { subfolder: "ConformLoadSchedule" }],
      },
    },
    {
      categoryName: "Energy Connectivity CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "ConnectivityNode" }, { subfolder: "ConnectivityNodeContainer" }],
      },
    },
    {
      categoryName: "Energy Control CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "ControlArea" }, { subfolder: "ControlAreaGeneratingUnit" }],
      },
    },
    {
      categoryName: "Energy Coordinate System CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "CoordinateSystem" }, { subfolder: "CsConverter" }],
      },
    },
    {
      categoryName: "Energy Current CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "CurrentFlow" },
          { subfolder: "CurrentLimit" },
          { subfolder: "Curve" },
          { subfolder: "CurveData" },
          { subfolder: "DayType" },
        ],
      },
    },
    {
      categoryName: "Energy DC CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "DCBaseTerminal" },
          { subfolder: "DCConductingEquipment" },
          { subfolder: "DCConverterUnit" },
          { subfolder: "DCEquipmentContainer" },
          { subfolder: "DCGround" },
          { subfolder: "DCLine" },
          { subfolder: "DCLineSegment" },
          { subfolder: "DCNode" },
          { subfolder: "DCSeriesDevice" },
          { subfolder: "DCShunt" },
          { subfolder: "DCTerminal" },
          { subfolder: "DCTopologicalIsland" },
          { subfolder: "DCTopologicalNode" },
        ],
      },
    },
    {
      categoryName: "Energy Diagram CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Diagram" },
          { subfolder: "DiagramLayoutVersion" },
          { subfolder: "DiagramObject" },
          { subfolder: "DiagramObjectGluePoint" },
          { subfolder: "DiagramObjectPoint" },
          { subfolder: "DiagramObjectStyle" },
          { subfolder: "DiagramStyle" },
        ],
      },
    },
    {
      categoryName: "Energy Discrete CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "DiscExcContIEEEDEC1A" },
          { subfolder: "DiscExcContIEEEDEC2A" },
          { subfolder: "DiscExcContIEEEDEC3A" },
          { subfolder: "DiscontinuousExcitationControlDynamics" },
          { subfolder: "DiscontinuousExcitationControlUserDefined" },
          { subfolder: "Discrete" },
          { subfolder: "DiscreteValue" },
        ],
      },
    },
    {
      categoryName: "Energy Dynamics CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "DynamicsFunctionBlock" },
          { subfolder: "DynamicsVersion" },
          { subfolder: "EarthFaultCompensator" },
        ],
      },
    },
    {
      categoryName: "Energy Energy CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "EnergyArea" },
          { subfolder: "EnergyConsumer" },
          { subfolder: "EnergySchedulingType" },
          { subfolder: "EnergySource" },
        ],
      },
    },
    {
      categoryName: "Energy Equipment CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Equipment" },
          { subfolder: "EquipmentBoundaryVersion" },
          { subfolder: "EquipmentContainer" },
          { subfolder: "EquipmentVersion" },
        ],
      },
    },
    {
      categoryName: "Energy Equivalent CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "EquivalentBranch" },
          { subfolder: "EquivalentEquipment" },
          { subfolder: "EquivalentInjection" },
          { subfolder: "EquivalentNetwork" },
          { subfolder: "EquivalentShunt" },
        ],
      },
    },
    {
      categoryName: "Energy Exc CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "ExcAC1A" },
          { subfolder: "ExcAC2A" },
          { subfolder: "ExcAC3A" },
          { subfolder: "ExcAC4A" },
          { subfolder: "ExcAC5A" },
          { subfolder: "ExcAC6A" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcANS" },
          { subfolder: "ExcAVR1" },
          { subfolder: "ExcAVR2" },
          { subfolder: "ExcAVR3" },
          { subfolder: "ExcAVR4" },
          { subfolder: "ExcAVR5" },
          { subfolder: "ExcAVR7" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcAC8B" },
          { subfolder: "ExcBBC" },
          { subfolder: "ExcCZ" },
          { subfolder: "ExcDC1A" },
          { subfolder: "ExcDC2A" },
          { subfolder: "ExcDC3A" },
          { subfolder: "ExcDC3A1" },
          { subfolder: "ExcELIN1" },
          { subfolder: "ExcELIN2" },
          { subfolder: "ExcHU" },
          { subfolder: "ExcIEEEAC1A" },
          { subfolder: "ExcIEEEAC2A" },
          { subfolder: "ExcIEEEAC3A" },
          { subfolder: "ExcIEEEAC4A" },
          { subfolder: "ExcIEEEAC5A" },
          { subfolder: "ExcIEEEAC6A" },
          { subfolder: "ExcIEEEAC7B" },
          { subfolder: "ExcIEEEAC8B" },
          { subfolder: "ExcIEEEDC1A" },
          { subfolder: "ExcIEEEDC2A" },
          { subfolder: "ExcIEEEDC3A" },
          { subfolder: "ExcIEEEDC4B" },
          { subfolder: "ExcIEEEST1A" },
          { subfolder: "ExcIEEEST2A" },
          { subfolder: "ExcIEEEST3A" },
          { subfolder: "ExcIEEEST4B" },
          { subfolder: "ExcIEEEST5B" },
          { subfolder: "ExcIEEEST6B" },
          { subfolder: "ExcIEEEST7B" },
          { subfolder: "ExcitationSystemDynamics" },
          { subfolder: "ExcitationSystemUserDefined" },
          { subfolder: "ExcOEX3T" },
          { subfolder: "ExcPIC" },
          { subfolder: "ExcREXS" },
          { subfolder: "ExcSCRX" },
          { subfolder: "ExcSEXS" },
          { subfolder: "ExcSK" },
          { subfolder: "ExcST1A" },
          { subfolder: "ExcST2A" },
          { subfolder: "ExcST3A" },
          { subfolder: "ExcST4B" },
          { subfolder: "ExcST6B" },
          { subfolder: "ExcST7B" },
          { subfolder: "ExternalNetworkInjection" },
          { subfolder: "FossilFuel" },
        ],
      },
    },
    {
      categoryName: "Energy Frequency CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Frequency" },
          { subfolder: "GeneratingUnit" },
          { subfolder: "GenICompensationForGenJ" },
          { subfolder: "GeographicalLocationVersion" },
          { subfolder: "GeographicalRegion" },
        ],
      },
    },
    {
      categoryName: "Energy Gov CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "GovCT1" },
          { subfolder: "GovCT2" },
          { subfolder: "GovGAST" },
          { subfolder: "GovGAST1" },
          { subfolder: "GovGAST2" },
          { subfolder: "GovGAST3" },
          { subfolder: "GovGAST4" },
          { subfolder: "GovGASTWD" },
          { subfolder: "GovHydro1" },
          { subfolder: "GovHydro2" },
          { subfolder: "GovHydro3" },
          { subfolder: "GovHydro4" },
          { subfolder: "GovHydroDD" },
          { subfolder: "GovHydroFrancis" },
          { subfolder: "GovHydroIEEE0" },
          { subfolder: "GovHydroIEEE2" },
          { subfolder: "GovHydroPelton" },
          { subfolder: "GovHydroPID" },
          { subfolder: "GovHydroPID2" },
          { subfolder: "GovHydroR" },
          { subfolder: "GovHydroWEH" },
          { subfolder: "GovHydroWPID" },
          { subfolder: "GovSteam0" },
          { subfolder: "GovSteam1" },
          { subfolder: "GovSteam2" },
          { subfolder: "GovSteamCC" },
          { subfolder: "GovSteamEU" },
          { subfolder: "GovSteamFV2" },
          { subfolder: "GovSteamFV3" },
          { subfolder: "GovSteamFV4" },
          { subfolder: "GovSteamIEEE1" },
          { subfolder: "GovSteamSGO" },
          { subfolder: "GrossToNetActivePowerCurve" },
          { subfolder: "GroundingImpedance" },
        ],
      },
    },
    {
      categoryName: "Energy Hydro CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "HydroGeneratingUnit" }, { subfolder: "HydroPowerPlant" }, { subfolder: "HydroPump" }],
      },
    },
    {
      categoryName: "Energy Inductance CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "IdentifiedObject" },
          { subfolder: "Inductance" },
          { subfolder: "InductancePerLength" },
          { subfolder: "Length" },
          { subfolder: "LimitSet" },
          { subfolder: "Line" },
          { subfolder: "LinearShuntCompensator" },
        ],
      },
    },
    {
      categoryName: "Energy Load CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "LoadAggregate" },
          { subfolder: "LoadArea" },
          { subfolder: "LoadComposite" },
          { subfolder: "LoadDynamics" },
          { subfolder: "LoadGenericNonLinear" },
          { subfolder: "LoadGroup" },
          { subfolder: "LoadMotor" },
          { subfolder: "LoadResponseCharacteristic" },
          { subfolder: "LoadStatic" },
          { subfolder: "LoadUserDefined" },
          { subfolder: "Location" },
        ],
      },
    },
    {
      categoryName: "Energy Measurment CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Measurement" },
          { subfolder: "MeasurementValue" },
          { subfolder: "MeasurementValueQuality" },
          { subfolder: "MeasurementValueSource" },
        ],
      },
    },
    {
      categoryName: "Energy Mechanical CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "MechanicalLoadDynamics" },
          { subfolder: "MechanicalLoadUserDefined" },
          { subfolder: "MechLoad1" },
          { subfolder: "Money" },
          { subfolder: "MutualCoupling" },
        ],
      },
    },
    {
      categoryName: "Energy NonConform CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "NonConformLoad" },
          { subfolder: "NonConformLoadGroup" },
          { subfolder: "NonConformLoadSchedule" },
        ],
      },
    },
    {
      categoryName: "Energy NonlinearShunt CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "NonlinearShuntCompensator" }, { subfolder: "NonlinearShuntCompensatorPoint" }],
      },
    },
    {
      categoryName: "Energy Operational Limit CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "OperationalLimit" },
          { subfolder: "OperationalLimitSet" },
          { subfolder: "OperationalLimitType" },
        ],
      },
    },
    {
      categoryName: "Energy Overexcitation CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "OverexcitationLimiterDynamics" },
          { subfolder: "OverexcitationLimiterUserDefined" },
          { subfolder: "OverexcLim2" },
          { subfolder: "OverexcLimIEEE" },
          { subfolder: "OverexcLimX1" },
          { subfolder: "OverexcLimX2" },
        ],
      },
    },
    {
      categoryName: "Energy PerCent CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "PerCent" }, { subfolder: "PerLengthDCLineParameter" }],
      },
    },
    {
      categoryName: "Energy Petersen CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "PetersenCoil" }],
      },
    },
    {
      categoryName: "Energy PFVA CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "PFVArControllerType1Dynamics" },
          { subfolder: "PFVArControllerType1UserDefined" },
          { subfolder: "PFVArControllerType2Dynamics" },
          { subfolder: "PFVArControllerType2UserDefined" },
          { subfolder: "PFVArType1IEEEPFController" },
          { subfolder: "PFVArType1IEEEVArController" },
          { subfolder: "PFVArType2Common1" },
          { subfolder: "PFVArType2IEEEPFController" },
          { subfolder: "PFVArType2IEEEVArController" },
        ],
      },
    },
    {
      categoryName: "Energy Phase CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "PhaseTapChanger" },
          { subfolder: "PhaseTapChangerAsymmetrical" },
          { subfolder: "PhaseTapChangerLinear" },
          { subfolder: "PhaseTapChangerNonLinear" },
          { subfolder: "PhaseTapChangerTable" },
          { subfolder: "PhaseTapChangerTablePoint" },
          { subfolder: "PhaseTapChangerTabular" },
          { subfolder: "PositionPoint" },
        ],
      },
    },
    {
      categoryName: "Energy Power System CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "PowerSystemResource" },
          { subfolder: "PowerSystemStabilizerDynamics" },
          { subfolder: "PowerSystemStabilizerUserDefined" },
          { subfolder: "PowerTransformer" },
          { subfolder: "PowerTransformerEnd" },
        ],
      },
    },
    {
      categoryName: "Energy Sv CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "ProprietaryParameterDynamics" }],
      },
    },
    {
      categoryName: "Energy Pss CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Pss1" },
          { subfolder: "Pss1A" },
          { subfolder: "Pss2B" },
          { subfolder: "Pss2ST" },
          { subfolder: "Pss5" },
          { subfolder: "PssELIN2" },
          { subfolder: "PssIEEE1A" },
          { subfolder: "PssIEEE2B" },
          { subfolder: "PssIEEE3B" },
          { subfolder: "PssIEEE4B" },
          { subfolder: "PssPTIST1" },
          { subfolder: "PssPTIST3" },
          { subfolder: "PssSB4" },
          { subfolder: "PssSH" },
          { subfolder: "PssSK" },
          { subfolder: "PssWECC" },
          { subfolder: "PU" },
          { subfolder: "Quality61850" },
          { subfolder: "RaiseLowerCommand" },
        ],
      },
    },
    {
      categoryName: "Energy RatioTap CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "RatioTapChanger" },
          { subfolder: "RatioTapChangerTable" },
          { subfolder: "RatioTapChangerTablePoint" },
        ],
      },
    },
    {
      categoryName: "Energy Reactance CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "Reactance" }, { subfolder: "ReactiveCapabilityCurve" }, { subfolder: "ReactivePower" }],
      },
    },
    {
      categoryName: "Energy Regular CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "RegularIntervalSchedule" }, { subfolder: "RegularTimePoint" }],
      },
    },
    {
      categoryName: "Energy Regulating CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "RegulatingCondEq" },
          { subfolder: "RegulatingControl" },
          { subfolder: "RegulationSchedule" },
          { subfolder: "RemoteInputSignal" },
          { subfolder: "ReportingGroup" },
        ],
      },
    },
    {
      categoryName: "Energy Resistance CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "Resistance" }, { subfolder: "ResistancePerLength" }],
      },
    },
    {
      categoryName: "Energy Rotation CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "RotatingMachine" },
          { subfolder: "RotatingMachineDynamics" },
          { subfolder: "RotationSpeed" },
        ],
      },
    },
    {
      categoryName: "Energy Season CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Season" },
          { subfolder: "SeasonDayTypeSchedule" },
          { subfolder: "Seconds" },
          { subfolder: "SeriesCompensator" },
          { subfolder: "SetPoint" },
          { subfolder: "ShuntCompensator" },
          { subfolder: "Simple_Float" },
          { subfolder: "StateVariablesVersion" },
          { subfolder: "StaticVarCompensator" },
          { subfolder: "SteadyStateHypothesisVersion" },
          { subfolder: "StringMeasurement" },
          { subfolder: "StringMeasurementValue" },
        ],
      },
    },
    {
      categoryName: "Energy Sub CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "SubGeographicalRegion" },
          { subfolder: "SubLoadArea" },
          { subfolder: "Substation" },
          { subfolder: "Susceptance" },
        ],
      },
    },
    {
      categoryName: "Energy Sv CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "SvInjection" },
          { subfolder: "SvPowerFlow" },
          { subfolder: "SvShuntCompensatorSections" },
          { subfolder: "SvStatus" },
          { subfolder: "SvTapStep" },
          { subfolder: "SvVoltage" },
        ],
      },
    },
    {
      categoryName: "Energy Switch CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [{ subfolder: "Switch" }, { subfolder: "SwitchSchedule" }],
      },
    },
    {
      categoryName: "Energy Synchronous Machine CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "SynchronousMachine" },
          { subfolder: "SynchronousMachineDetailed" },
          { subfolder: "SynchronousMachineDynamics" },
          { subfolder: "SynchronousMachineEquivalentCircuit" },
          { subfolder: "SynchronousMachineTimeConstantReactance" },
          { subfolder: "SynchronousMachineUserDefined" },
        ],
      },
    },
    {
      categoryName: "Energy Tap Changer CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "TapChanger" },
          { subfolder: "TapChangerControl" },
          { subfolder: "TapChangerTablePoint" },
          { subfolder: "TapSchedule" },
          { subfolder: "Temperature" },
          { subfolder: "Terminal" },
          { subfolder: "TextDiagramObject" },
          { subfolder: "ThermalGeneratingUnit" },
          { subfolder: "TieFlow" },
        ],
      },
    },
    {
      categoryName: "Energy Topology CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "TopologicalIsland" },
          { subfolder: "TopologicalNode" },
          { subfolder: "TopologyBoundaryVersion" },
          { subfolder: "TopologyVersion" },
          { subfolder: "TransformerEnd" },
        ],
      },
    },
    {
      categoryName: "Energy Turbine CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "TurbineGovernorDynamics" },
          { subfolder: "TurbineGovernorUserDefined" },
          { subfolder: "TurbineLoadControllerDynamics" },
          { subfolder: "TurbineLoadControllerUserDefined" },
          { subfolder: "TurbLCFB1" },
        ],
      },
    },
    {
      categoryName: "Energy Underexcitation CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "UnderexcitationLimiterDynamics" },
          { subfolder: "UnderexcitationLimiterUserDefined" },
          { subfolder: "UnderexcLim2Simplified" },
          { subfolder: "UnderexcLimIEEE1" },
          { subfolder: "UnderexcLimIEEE2" },
          { subfolder: "UnderexcLimX1" },
          { subfolder: "UnderexcLimX2" },
        ],
      },
    },
    {
      categoryName: "Energy ValueAliasSet CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "VAdjIEEE" },
          { subfolder: "ValueAliasSet" },
          { subfolder: "ValueToAlias" },
          { subfolder: "VCompIEEEType1" },
          { subfolder: "VCompIEEEType2" },
          { subfolder: "VisibilityLayer" },
        ],
      },
    },
    {
      categoryName: "Energy Voltage CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "Voltage" },
          { subfolder: "VoltageAdjusterDynamics" },
          { subfolder: "VoltageAdjusterUserDefined" },
          { subfolder: "VoltageCompensatorDynamics" },
          { subfolder: "VoltageCompensatorUserDefined" },
          { subfolder: "VoltageLevel" },
          { subfolder: "VoltageLimit" },
          { subfolder: "VoltagePerReactivePower" },
          { subfolder: "VolumeFlowRate" },
          { subfolder: "VsCapabilityCurve" },
          { subfolder: "VsConverter" },
        ],
      },
    },
    {
      categoryName: "Energy Wind CIM",
      schemas: {
        group: "dataModel.EnergyCIM",
        models: [
          { subfolder: "WindAeroConstIEC" },
          { subfolder: "WindAeroLinearIEC" },
          { subfolder: "WindContCurrLimIEC" },
          { subfolder: "WindContPitchAngleIEC" },
          { subfolder: "WindContPType3IEC" },
          { subfolder: "WindContPType4aIEC" },
          { subfolder: "WindContPType4bIEC" },
          { subfolder: "WindContQIEC" },
          { subfolder: "WindContRotorRIEC" },
          { subfolder: "WindDynamicsLookupTable" },
          { subfolder: "WindGeneratingUnit" },
          { subfolder: "WindGenTurbineType1IEC" },
          { subfolder: "WindGenTurbineType2IEC" },
          { subfolder: "WindGenTurbineType3aIEC" },
          { subfolder: "WindGenTurbineType3bIEC" },
          { subfolder: "WindGenTurbineType3IEC" },
          { subfolder: "WindGenType4IEC" },
          { subfolder: "WindMechIEC" },
          { subfolder: "WindPitchContEmulIEC" },
          { subfolder: "WindPlantDynamics" },
          { subfolder: "WindPlantFreqPcontrolIEC" },
          { subfolder: "WindPlantIEC" },
          { subfolder: "WindPlantReactiveControlIEC" },
          { subfolder: "WindPlantUserDefined" },
          { subfolder: "WindProtectionIEC" },
          { subfolder: "WindTurbineType1or2Dynamics" },
          { subfolder: "WindTurbineType1or2IEC" },
          { subfolder: "WindTurbineType3or4Dynamics" },
          { subfolder: "WindTurbineType3or4IEC" },
          { subfolder: "WindTurbineType4aIEC" },
          { subfolder: "WindTurbineType4bIEC" },
          { subfolder: "WindType1or2UserDefined" },
          { subfolder: "WindType3or4UserDefined" },
        ],
      },
    },
    */
