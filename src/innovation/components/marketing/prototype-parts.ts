export const prototypeParts = [
  {
    id: "01_mouthguard_lower_shell",
    name: "Mouthguard shell",
    color: "#939b95",
    lift: 0,
    description:
      "The curved gray mouthguard supports the embedded pressure sensor. Its U-shaped opening faces away from the outside loop.",
  },
  {
    id: "02_mouthguard_cover",
    name: "Soft bite cover",
    color: "#c5cec5",
    lift: 22,
    description:
      "A proposed soft cover sits over the pressure sensor. Lift it in the exploded view to see the sensor beneath it.",
  },
  {
    id: "03_loop_with_board_housing",
    name: "Outside loop",
    color: "#d99054",
    lift: 0,
    description:
      "The orange loop provides a grip and houses the board at its far end, outside the mouthguard area.",
  },
  {
    id: "04_embedded_pressure_sensor",
    name: "Pressure sensor",
    color: "#d7ad4c",
    lift: 11,
    description:
      "The only electronic sensing component inside the mouthguard. It measures pressure applied to the bite surface. This disc represents its proposed location, not its final dimensions.",
  },
  {
    id: "05_sensor_load_pad",
    name: "Load-transfer pad",
    color: "#e5d4ac",
    lift: 16,
    description:
      "A small mechanical pad transfers force from the cover onto the sensor. It is not an electronic component.",
  },
  {
    id: "06_controller_board",
    name: "Controller board",
    color: "#286e62",
    lift: 12,
    description:
      "The controller reads the pressure signal and supports sending readings to the dashboard. The board is shown inside the outside loop, separate from the mouthguard.",
  },
  {
    id: "07_processor_module",
    name: "Processor module",
    color: "#293b3a",
    lift: 12,
    description:
      "A simplified representation of the electronics on the controller board. The exact component layout will follow the chosen hardware.",
  },
  {
    id: "08_usb_connector",
    name: "USB connector",
    color: "#b9c3c4",
    lift: 12,
    description:
      "Represents a connection for prototype power and programming. Final port access and enclosure details still need to be designed.",
  },
  {
    id: "09_loop_housing_lid",
    name: "Electronics cover",
    color: "#edb07a",
    lift: 35,
    description:
      "Covers the electronics compartment in the orange loop. The exploded view lifts it to reveal the board and USB connector.",
  },
];
