"""Hello unit test module."""

from src/notify.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello notification-svc"
