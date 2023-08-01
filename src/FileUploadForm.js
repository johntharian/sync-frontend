import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const FileUploadForm = () => {
  const [videof, setVideof] = useState(null);
  const [audiof, setAudiof] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleVideoChnage = (e) => {
    console.log(e.target.files[0]);
    setVideof(e.target.files[0]);
  };

  const handleAudioChange = (e) => {
    console.log(e.target.files[0]);
    setAudiof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Video File:", videof);
    console.log("Audio File:", audiof);

    const maxFileSize = 10 * 1024 * 1024; // 10 MB (adjust as needed)
    if (videof && videof.size > maxFileSize) {
      alert("Video file size exceeds the allowed limit.");
      return;
    }

    if (audiof && audiof.size > maxFileSize) {
      alert("Audio file size exceeds the allowed limit.");
      return;
    }

    const formData = new FormData();
    formData.append("videof", videof);
    formData.append("audiof", audiof);

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        body: formData,
      });
      console.log(res);

      //   var msg= await res.json()
      //   console.log(msg);

      //   if ("Durations" in msg) {
      //     alert("Video and audio should be same length")
      //     setLoading(false)
      //     return
      //   }
      //   else{
      const data = await res.blob();
      const videoObjectUrl = URL.createObjectURL(data);

      setVideoUrl(videoObjectUrl);

      setLoading(false);
      //   }
    } catch (e) {
      console.log("error while sending data", e);
      setLoading(false);
    }
  };

  return (
    <>
      <Container style={{ paddingTop: "200px" }}>
        <Row>
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit} style={{ paddingLeft: "200px" }}>
            <p>Max file size is 10mb</p>
              <Form.Group className="mb-3" controlId="videof">
                <Form.Label>Video File:</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoChnage}
                  style={{ width: "200px" }}
                />
                <Form.Text className="text-muted">
                  The video and audio should be of same size
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="audiof">
                <Form.Label>Audio File:</Form.Label>
                <Form.Control
                  type="file"
                  accept="audio/wav"
                  onChange={handleAudioChange}
                  style={{ width: "200px" }}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "5px" }}
                    />
                    Loading...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </Form>
          </Col>
          <Col xs={12} md={6}>
            {videoUrl ? (
              <video
                style={{ width: "400px", height: "300px", marginTop: "-50px" }}
                controls
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "100%" }}
              >
                <p>No video available yet.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FileUploadForm;
