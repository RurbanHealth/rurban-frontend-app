import React, { Component } from 'react';
import { Image, View, StyleProp, ViewStyle } from 'react-native';

interface AnalogClockProps {
  backgroundImage?: string;
  clockSize?: number;
  clockBorderWidth?: number;
  clockCentreSize?: number;
  clockCentreColor?: string;
  hourHandColor?: string;
  hourHandCurved?: boolean;
  hourHandLength?: number;
  hourHandWidth?: number;
  hourHandOffset?: number;
  minuteHandColor?: string;
  minuteHandCurved?: boolean;
  minuteHandLength?: number;
  minuteHandWidth?: number;
  minuteHandOffset?: number;
  secondHandColor?: string;
  secondHandCurved?: boolean;
  secondHandLength?: number;
  secondHandWidth?: number;
  secondHandOffset?: number;
}

interface AnalogClockState {
  sec: number;
  min: number;
  hour: number;
}

export default class AnalogClock extends Component<AnalogClockProps, AnalogClockState> {
  static defaultProps: AnalogClockProps = {
    backgroundImage: require("@assets/clockBack.png"),
    clockSize: 270,
    clockBorderWidth: 7,
    clockCentreSize: 15,
    clockCentreColor: 'black',
    hourHandColor: 'black',
    hourHandCurved: true,
    hourHandLength: 70,
    hourHandWidth: 5.5,
    hourHandOffset: 0,
    minuteHandColor: 'black',
    minuteHandCurved: true,
    minuteHandLength: 100,
    minuteHandWidth: 5,
    minuteHandOffset: 0,
    secondHandColor: 'black',
    secondHandCurved: false,
    secondHandLength: 120,
    secondHandWidth: 2,
    secondHandOffset: 0,
  };

  private timer: NodeJS.Timer | undefined;

  constructor(props: AnalogClockProps) {
    super(props);

    let d = new Date();

    this.state = {
      sec: d.getSeconds() * 6,
      min: d.getMinutes() * 6 + (d.getSeconds() * 6) / 60,
      hour: ((d.getHours() % 12) / 12) * 360 + 90 + (d.getMinutes() * 6 + (d.getSeconds() * 6) / 60) / 12,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      let d = new Date();
      this.setState({
        sec: d.getSeconds() * 6,
        min: d.getMinutes() * 6 + (d.getSeconds() * 6) / 60,
        hour: ((d.getHours() % 12) / 12) * 360 + 90 + (d.getMinutes() * 6 + (d.getSeconds() * 6) / 60) / 12,
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  clockFrame(): StyleProp<ViewStyle> {
    return {
      width: this.props.clockSize,
      height: this.props.clockSize,
      position: 'relative',
      borderColor: 'black',
      borderWidth: this.props.clockBorderWidth,
      borderRadius: this.props.clockSize! / 2,
    };
  }

  clockHolder(): StyleProp<ViewStyle> {
    return {
      width: this.props.clockSize,
      height: this.props.clockSize,
      position: 'absolute',
      right: -this.props.clockBorderWidth!,
      bottom: -this.props.clockBorderWidth!,
    };
  }

  clockFace(): StyleProp<ViewStyle> {
    return {
      width: this.props.clockCentreSize,
      height: this.props.clockCentreSize,
      backgroundColor: this.props.clockCentreColor,
      borderRadius: this.props.clockCentreSize! / 2,
      top: (this.props.clockSize! - this.props.clockCentreSize!) / 2,
      left: (this.props.clockSize! - this.props.clockCentreSize!) / 2,
    };
  }

  hourHandStyles(): StyleProp<ViewStyle> {
    return {
      width: 0,
      height: 0,
      position: 'absolute',
      backgroundColor: this.props.hourHandColor,
      top: this.props.clockSize! / 2,
      left: this.props.clockSize! / 2,
      marginVertical: -this.props.hourHandWidth!,
      marginLeft: -this.props.hourHandLength! / 2,
      paddingVertical: this.props.hourHandWidth,
      paddingLeft: this.props.hourHandLength,
      borderTopLeftRadius: this.props.hourHandCurved ? this.props.hourHandWidth : 0,
      borderBottomLeftRadius: this.props.hourHandCurved ? this.props.hourHandWidth : 0,
    };
  }

  minuteHandStyles(): StyleProp<ViewStyle> {
    return {
      width: 0,
      height: 0,
      position: 'absolute',
      backgroundColor: this.props.minuteHandColor,
      top: this.props.clockSize! / 2,
      left: this.props.clockSize! / 2,
      marginTop: -(this.props.minuteHandLength! / 2),
      marginHorizontal: -this.props.minuteHandWidth!,
      paddingTop: this.props.minuteHandLength,
      paddingHorizontal: this.props.minuteHandWidth,
      borderTopLeftRadius: this.props.minuteHandCurved ? this.props.minuteHandWidth : 0,
      borderTopRightRadius: this.props.minuteHandCurved ? this.props.minuteHandWidth : 0,
    };
  }

  secondHandStyles(): StyleProp<ViewStyle> {
    return {
      width: 0,
      height: 0,
      position: 'absolute',
      backgroundColor: this.props.secondHandColor,
      top: this.props.clockSize! / 2,
      left: this.props.clockSize! / 2,
      marginTop: -(this.props.secondHandLength! / 2),
      marginHorizontal: -this.props.secondHandWidth!,
      paddingTop: this.props.secondHandLength,
      paddingHorizontal: this.props.secondHandWidth,
      borderTopLeftRadius: this.props.secondHandCurved ? this.props.secondHandWidth : 0,
      borderTopRightRadius: this.props.secondHandCurved ? this.props.secondHandWidth : 0,
    };
  }

  render() {
    return (
      <View style={this.clockFrame()}>
         {/* Uncomment for background image */}
         <Image
         tintColor={'white'}
          style={{ width: this.props.clockSize! - this.props.clockBorderWidth! * 2,
            height: this.props.clockSize! - this.props.clockBorderWidth! * 2 }}
          resizeMode="stretch"
          source={require('@assets/clockBack.png')}
        />

        <View style={this.clockHolder()}>
          <View
            style={[
              this.hourHandStyles(),
              {
                transform: [
                  { rotate: this.state.hour + 'deg' },
                  { translateX: -(this.props.hourHandOffset! + this.props.hourHandLength! / 2) },
                ],
              },
            ]}
          />

          <View
            style={[
              this.minuteHandStyles(),
              {
                transform: [
                  { rotate: this.state.min + 'deg' },
                  { translateY: -(this.props.minuteHandOffset! + this.props.minuteHandLength! / 2) },
                ],
              },
            ]}
          />

          <View
            style={[
              this.secondHandStyles(),
              {
                transform: [
                  { rotate: this.state.sec + 'deg' },
                  { translateY: -(this.props.secondHandOffset! + this.props.secondHandLength! / 2) },
                ],
              },
            ]}
          />

          <View style={this.clockFace()} />
        </View>
      </View>
    );
  }
}
