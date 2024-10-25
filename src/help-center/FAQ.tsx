export default function FAQ() {
  return (
    <div className="w-100">
      <h4 className="text-primary-emphasis mb-2" id="faqs">
        <i
          className="bi bi-question-circle me-2"
          style={{ fontSize: "24px" }}
        />
        Frequently Asked Questions
      </h4>
      <p className="fw-light my-3" style={{ fontSize: "16px" }}>
        Got questions about AquaSense Visuals? Check out the FAQs below for
        quick answers on setup, troubleshooting, and managing your system.
      </p>
      <div className="d-flex justify-content-center my-3 w-100">
        <div
          className="accordion w-100"
          id="faqsaccordion"
          style={{ maxWidth: "800px" }}
        >
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs1"
              >
                What should I do if the sensor port values are not updating?
              </button>
            </h2>
            <div
              id="faqs1"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                <h6>Troubleshooting Steps</h6>
                <ul>
                  <li className="mb-1">
                    Ensure you have a stable internet connection. If not, find a
                    reliable connection and try again.
                  </li>
                  <li className="mb-1">
                    On your{" "}
                    <span className="fw-medium text-primary">Home Page</span>,
                    check if the sensor ports are active. You can find this
                    information on each sensor tile, just below the defined
                    sensor type. If any of the ports are inactive, consider
                    inspecting the device on-site.
                  </li>
                </ul>
                <h6>On-site Inspection</h6>
                <ol>
                  <li className="mb-1">
                    Check if the local server is running. If it is, but the
                    issue persists, try restarting the server.
                  </li>
                  <li className="mb-1">
                    Ensure the device is powered on and properly plugged into an
                    outlet. Confirm that there are no power outages in the
                    location.
                  </li>
                  <li className="mb-1">
                    Verify that the sensor is securely plugged into the port. If
                    it still doesn't work, try unplugging and plugging it back
                    in, or move the sensor to another port.
                  </li>
                  <li className="mb-1">
                    Inspect the sensor for damage. If necessary, perform a
                    sensor calibration to confirm it’s functioning correctly.
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs2"
              >
                Why isn't the water change button working, and how can I fix it?
              </button>
            </h2>
            <div
              id="faqs2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                If the water change button is unclickable, it could be because
                the local server is overriding the system's actuation control.
                This usually happens when a sensor reading exceeds the defined
                threshold, triggering the system's automatic actuation. Control
                will be returned to you once the actuation process is complete.
                <br />
                <br />
                If this is not the case, try refreshing the website and ensure
                you have a stable internet connection.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs3"
              >
                Who is allowed to configure and manage the AquaSense Visuals
                platform?
              </button>
            </h2>
            <div
              id="faqs3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                Port configurations and other system controls are available only
                to administrators. Guest users can view and export data but
                cannot make changes, to prevent unauthorized system control.
                <br />
                <br />
                If you're unsure of your role, you can check your profile by
                clicking the user icon next to your username in the top-right
                corner of the window.
                <br />
                <br />
                <h6>How to become an administrator?</h6>
                Role assignments are managed exclusively by the developers.
                Please contact us to confirm that you’ve been granted the
                necessary permissions for your role.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs4"
              >
                I accidentally deleted a displayed port. How can I restore it?
              </button>
            </h2>
            <div
              id="faqs4"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                Unfortunately, once a port is deleted, it cannot be restored.
                However, you can still download the history from the data
                archives.
                <br />
                <br />
                If you’d like, you can reconfigure the deleted port to continue
                monitoring the connected sensor.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs5"
              >
                What does the term "ADC Formula" mean when configuring a port
                channel?
              </button>
            </h2>
            <div
              id="faqs5"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                The Analog-to-Digital Conversion (ADC) formula refers to how
                sensor readings are converted from analog values (in millivolts)
                into the corresponding unit of measurement for the connected
                sensor.
                <br />
                <br />
                When selecting an ADC formula, it's important to ensure that the
                correct one is used for the appropriate port to avoid
                misinterpretation of data. If you made an error in your initial
                port channel configuration, you can reconfigure the port through
                the{" "}
                <span className="fw-medium text-primary">
                  Sensor Details Page
                </span>
                .
                <br />
                <br />
                <h6>Can't find your ADC Formula?</h6>
                ADC formulas are generated during sensor calibration, so ensure
                they're saved correctly. When assigning such formula to a port
                channel, know the formula ID and label to match it with the
                correct analog-to-digital conversion.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
